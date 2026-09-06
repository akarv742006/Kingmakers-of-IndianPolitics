import { CRISIS_EVENT_TEMPLATES } from '../data/crisisEventsData.js';
import { ChiefJusticeAIAgent, ElectionCommissionAIAgent } from './aiAgentsEngine.js';
import { PoliticalMechanicsEngine } from './politicalMechanicsEngine.js';

export class ServerGameEngine {
  /**
   * Propose a Bill with Political Capital deduction
   */
  static proposeBillWithPoliticalCapital(state, billData) {
    const partyIndex = state.parties.findIndex((p) => p.id === billData.proposerPartyId);
    if (partyIndex === -1) {
      return { success: false, state, message: 'Proposer party not found.' };
    }

    const party = state.parties[partyIndex];
    const currentPC = party.politicalCapital ?? 100;
    const PC_COST = 25;

    if (currentPC < PC_COST) {
      return {
        success: false,
        state,
        message: `Insufficient Political Capital! (Required: ${PC_COST} PC, Available: ${currentPC} PC). Work in your constituency to build Political Capital.`,
      };
    }

    const updatedParties = state.parties.map((p) =>
      p.id === party.id ? { ...p, politicalCapital: Math.max(0, currentPC - PC_COST) } : p
    );

    const newBill = {
      id: `bill-${Date.now()}`,
      title: billData.title,
      description: billData.description,
      category: billData.category,
      billType: billData.billType || 'ORDINARY',
      proposerPartyId: billData.proposerPartyId,
      proposedBy: billData.proposedBy || state.userHandle || '@Candidate',
      isCustomScheme: !!billData.isCustomScheme,
      supporterPartyIds: billData.supporterPartyIds || [],
      effects: billData.effects || {
        economy: 20,
        employment: 20,
        healthcare: 15,
        education: 15,
        agriculture: 15,
        infrastructure: 20,
        treasuryCostCrores: billData.treasuryCostCrores || 5000,
        publicSentimentIndex: 30,
      },
      targetStates: billData.targetStates,
      status: 'INTRODUCED',
      votingExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24-Hour Parliamentary Floor Voting Window
      playerVotes: {},
      whips: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `${newBill.isCustomScheme ? '🚀 NEW CUSTOM SCHEME PROPOSED' : '📜 NEW BILL INTRODUCED'}: ${newBill.title}`,
      content: `Proposed by ${billData.proposedBy || party.shortName} (${party.shortName}). Category: ${newBill.category}. 24-Hour Parliamentary Floor Voting is now OPEN for all players and MPs!`,
      snippet: `Proposed by ${party.shortName}. 24-Hour Voting Open on Lok Sabha Floor.`,
      author: 'Lok Sabha Table Desk',
      source: 'Lok Sabha Speaker Desk',
      category: 'PARLIAMENT',
      bias: 'NEUTRAL',
      sentiment: 'NEUTRAL',
      affectedPartyIds: [party.id],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      success: true,
      state: {
        ...state,
        parties: updatedParties,
        bills: [newBill, ...state.bills],
        articles: [newsArticle, ...state.articles],
      },
      message: `Bill "${newBill.title}" introduced in Parliament! (25 Political Capital deducted)`,
    };
  }

  /**
   * Advance Bill Stage
   */
  static advanceBillStage(state, billId, nextStage) {
    const billIndex = state.bills.findIndex((b) => b.id === billId);
    if (billIndex === -1) {
      return { success: false, state, message: 'Bill not found.' };
    }

    const bill = state.bills[billIndex];
    const updatedBills = state.bills.map((b) => (b.id === billId ? { ...b, status: nextStage } : b));

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `🏛️ PARLIAMENT UPDATE: '${bill.title}' moved to ${nextStage}`,
      content: `Bill status updated to ${nextStage} stage.`,
      snippet: `Bill status updated to ${nextStage} stage.`,
      author: 'DD News',
      source: 'DD News',
      category: 'PARLIAMENT',
      bias: 'NEUTRAL',
      sentiment: 'NEUTRAL',
      affectedPartyIds: [bill.proposerPartyId],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      success: true,
      state: {
        ...state,
        bills: updatedBills,
        articles: [newsArticle, ...state.articles],
      },
      message: `Bill stage advanced to ${nextStage}.`,
    };
  }

  /**
   * Issue Party Whip on a Bill
   */
  static issuePartyWhip(state, billId, partyId, direction, whipType) {
    const billIndex = state.bills.findIndex((b) => b.id === billId);
    if (billIndex === -1) {
      return { success: false, state, message: 'Target bill not found.' };
    }

    const party = state.parties.find((p) => p.id === partyId);
    if (!party) {
      return { success: false, state, message: 'Party not found.' };
    }

    const currentPC = party.politicalCapital ?? 100;
    const WHIP_COST = whipType === 'THREE_LINE' ? 10 : 5;
    if (currentPC < WHIP_COST) {
      return { success: false, state, message: `Insufficient Political Capital to issue ${whipType} Whip (Required: ${WHIP_COST} PC)` };
    }

    const bill = state.bills[billIndex];
    const existingWhips = bill.whips || [];
    const updatedWhips = existingWhips.filter((w) => w.partyId !== partyId);
    updatedWhips.push({ partyId, direction, whipType });

    const updatedBills = state.bills.map((b) => (b.id === billId ? { ...b, whips: updatedWhips } : b));
    const updatedParties = state.parties.map((p) =>
      p.id === partyId ? { ...p, politicalCapital: Math.max(0, currentPC - WHIP_COST) } : p
    );

    return {
      success: true,
      state: {
        ...state,
        bills: updatedBills,
        parties: updatedParties,
      },
      message: `${party.shortName} issued ${whipType} Whip (${direction}) for bill "${bill.title}".`,
    };
  }

  /**
   * Anti-Cheat & Authoritative Execution of Parliamentary Floor Vote
   */
  static processFloorVote(state, billId, playerPartyId, playerVote) {
    const billIndex = state.bills.findIndex((b) => b.id === billId);
    if (billIndex === -1) {
      return { success: false, state, message: 'Anti-Cheat Error: Target Bill ID not found on server.' };
    }

    const targetBill = state.bills[billIndex];
    const validVoteStatuses = ['TABLED', 'INTRODUCED', 'DEBATE', 'LOK_SABHA_VOTE'];
    if (!validVoteStatuses.includes(targetBill.status)) {
      return { success: false, state, message: `Anti-Cheat Error: Bill is not in floor voting status (Current status: ${targetBill.status}).` };
    }

    const yesParties = [];
    const noParties = [];
    const abstainParties = [];

    const partySeats = {};
    state.parties.forEach((p) => (partySeats[p.id] = 0));
    state.seats.forEach((seat) => {
      partySeats[seat.leadingPartyId] = (partySeats[seat.leadingPartyId] || 0) + 1;
    });

    state.parties.forEach((party) => {
      const partyWhip = targetBill.whips?.find((w) => w.partyId === party.id);

      if (party.id === playerPartyId) {
        if (playerVote === 'YES') yesParties.push(party.id);
        else if (playerVote === 'NO') noParties.push(party.id);
        else abstainParties.push(party.id);
        return;
      }

      if (partyWhip && partyWhip.direction !== 'FREE_VOTE' && partyWhip.whipType !== 'ONE_LINE') {
        if (partyWhip.direction === 'YES') yesParties.push(party.id);
        else if (partyWhip.direction === 'NO') noParties.push(party.id);
        else abstainParties.push(party.id);
        return;
      }

      const isGovtAlliance = party.id === state.governingPartyId || party.allianceId === 'nda';
      const isProposer = party.id === targetBill.proposerPartyId || targetBill.supporterPartyIds?.includes(party.id);

      if (isProposer || isGovtAlliance) {
        if (targetBill.effects.publicSentimentIndex < -40) {
          abstainParties.push(party.id);
        } else {
          yesParties.push(party.id);
        }
      } else {
        if (
          targetBill.effects.publicSentimentIndex > 40 &&
          (targetBill.effects.healthcare > 40 || targetBill.effects.agriculture > 40 || targetBill.effects.education > 40)
        ) {
          yesParties.push(party.id);
        } else if (targetBill.effects.publicSentimentIndex < 0 || targetBill.effects.treasuryCostCrores > 500) {
          noParties.push(party.id);
        } else {
          if (Math.random() > 0.4) noParties.push(party.id);
          else abstainParties.push(party.id);
        }
      }
    });

    let totalYes = 0;
    let totalNo = 0;
    let totalAbstain = 0;

    yesParties.forEach((pId) => (totalYes += partySeats[pId] || 0));
    noParties.forEach((pId) => (totalNo += partySeats[pId] || 0));
    abstainParties.forEach((pId) => (totalAbstain += partySeats[pId] || 0));

    const totalPresent = totalYes + totalNo + totalAbstain;
    const quorumSatisfied = totalPresent >= 55;

    if (!quorumSatisfied) {
      const updatedBills = state.bills.map((b) =>
        b.id === billId ? { ...b, status: 'FAILED', quorumSatisfied: false } : b
      );
      return {
        success: true,
        state: { ...state, bills: updatedBills },
        message: `Lok Sabha vote failed due to lack of Quorum (${totalPresent}/55 required MPs present).`,
      };
    }

    let isLokSabhaPassed = false;
    if (targetBill.billType === 'CONSTITUTIONAL_AMENDMENT') {
      const votingSeats = totalYes + totalNo;
      isLokSabhaPassed = totalYes >= 272 && (votingSeats > 0 ? totalYes / votingSeats >= 0.667 : false);
    } else {
      isLokSabhaPassed = totalYes > totalNo;
    }

    const antiDefectionNotices = [];
    const partyPopularityDeltas = {};

    targetBill.whips?.forEach((whip) => {
      if (whip.whipType === 'THREE_LINE' && whip.direction !== 'FREE_VOTE') {
        const pSeats = partySeats[whip.partyId] || 0;
        let defectedCount = 0;

        if (whip.partyId === playerPartyId) {
          if (whip.direction === 'YES' && playerVote !== 'YES') defectedCount = Math.ceil(pSeats * 0.2);
          if (whip.direction === 'NO' && playerVote !== 'NO') defectedCount = Math.ceil(pSeats * 0.2);
        }

        if (defectedCount > 0) {
          const ratio = defectedCount / Math.max(1, pSeats);
          const isLegitimateSplit = ratio >= 0.667;

          if (isLegitimateSplit) {
            antiDefectionNotices.push({
              partyId: whip.partyId,
              defectedMpCount: defectedCount,
              totalPartyMps: pSeats,
              defectionRatio: Number(ratio.toFixed(2)),
              isLegitimateSplit: true,
              summary: `Recognized Party Faction Split under 10th Schedule (${defectedCount}/${pSeats} MPs voted contrary to whip). No disqualification penalty.`,
            });
          } else {
            partyPopularityDeltas[whip.partyId] = (partyPopularityDeltas[whip.partyId] || 0) - 15;
            antiDefectionNotices.push({
              partyId: whip.partyId,
              defectedMpCount: defectedCount,
              totalPartyMps: pSeats,
              defectionRatio: Number(ratio.toFixed(2)),
              isLegitimateSplit: false,
              summary: `ANTI-DEFECTION NOTICE TRIGGERED under 10th Schedule! ${defectedCount} MPs violated 3-Line Whip. Disqualification proceedings initiated & popularity penalized (-15).`,
            });
          }
        }
      }
    });

    const fx = targetBill.effects;
    const sectorScore =
      fx.economy * 0.2 +
      fx.employment * 0.2 +
      fx.healthcare * 0.15 +
      fx.education * 0.15 +
      fx.agriculture * 0.15 +
      fx.infrastructure * 0.15;

    const isPopular = sectorScore > 0;

    let nextStatus = 'FAILED';
    let rajyaSabhaPassed = false;
    let presidentialAssentStatus = undefined;

    if (isLokSabhaPassed) {
      if (targetBill.billType === 'MONEY') {
        nextStatus = 'PRESIDENTIAL_ASSENT';
        rajyaSabhaPassed = true;
        presidentialAssentStatus = 'PENDING';
      } else {
        nextStatus = 'RAJYA_SABHA_VOTE';
        rajyaSabhaPassed = true;
      }
    } else {
      nextStatus = 'FAILED';
    }

    let nationalApprovalDelta = 0;

    if (isLokSabhaPassed) {
      if (isPopular) {
        nationalApprovalDelta = Math.min(12, Math.max(3, Math.round(sectorScore * 0.15)));
        yesParties.forEach((pId) => {
          partyPopularityDeltas[pId] = (partyPopularityDeltas[pId] || 0) + (pId === targetBill.proposerPartyId ? 6 : 3);
        });
        noParties.forEach((pId) => {
          partyPopularityDeltas[pId] = (partyPopularityDeltas[pId] || 0) - 2;
        });
      } else {
        nationalApprovalDelta = -Math.min(20, Math.max(8, Math.round(Math.abs(sectorScore) * 0.25)));
        yesParties.forEach((pId) => {
          const isGovt = pId === state.governingPartyId;
          partyPopularityDeltas[pId] = (partyPopularityDeltas[pId] || 0) + (isGovt ? -12 : -7);
        });
        noParties.forEach((pId) => {
          partyPopularityDeltas[pId] = (partyPopularityDeltas[pId] || 0) + 5;
        });
      }
    } else {
      if (isPopular) {
        nationalApprovalDelta = targetBill.proposerPartyId === state.governingPartyId ? -4 : 0;
        yesParties.forEach((pId) => (partyPopularityDeltas[pId] = (partyPopularityDeltas[pId] || 0) - 2));
        noParties.forEach((pId) => (partyPopularityDeltas[pId] = (partyPopularityDeltas[pId] || 0) - 3));
      } else {
        noParties.forEach((pId) => (partyPopularityDeltas[pId] = (partyPopularityDeltas[pId] || 0) + 4));
        yesParties.forEach((pId) => (partyPopularityDeltas[pId] = (partyPopularityDeltas[pId] || 0) - 4));
      }
    }

    const newGovtApproval = Math.min(100, Math.max(0, state.governmentApproval + nationalApprovalDelta));

    const updatedParties = state.parties.map((p) => {
      const delta = partyPopularityDeltas[p.id] || 0;
      let newApproval = Math.min(100, Math.max(0, p.approvalRating + delta));
      let newFunds = p.fundsInCrores;
      if (isLokSabhaPassed && p.id === targetBill.proposerPartyId && fx.treasuryCostCrores > 0) {
        newFunds = Math.max(0, p.fundsInCrores - Math.round(fx.treasuryCostCrores * 0.1));
      }
      return { ...p, approvalRating: newApproval, fundsInCrores: newFunds };
    });

    const updatedSeats = state.seats.map((seat) => {
      const isTargetState = targetBill.targetStates && targetBill.targetStates.includes(seat.state);
      if (isTargetState || !targetBill.targetStates || targetBill.targetStates.length === 0) {
        let demoMultiplier = 1.0;
        if (seat.demographicType === 'RURAL_AGRI') {
          demoMultiplier = fx.agriculture > 20 || targetBill.category === 'AGRICULTURE' || targetBill.category === 'WELFARE' ? 1.6 : 0.8;
        } else if (seat.demographicType === 'URBAN_METRO') {
          demoMultiplier = fx.infrastructure > 20 || fx.employment > 20 || targetBill.category === 'INFRASTRUCTURE' ? 1.5 : 0.9;
        } else if (seat.demographicType === 'INDUSTRIAL_COASTAL') {
          demoMultiplier = fx.economy > 20 || targetBill.category === 'ECONOMIC' ? 1.5 : 0.9;
        }

        const baseSatDelta = isLokSabhaPassed ? (isPopular ? 8 : -10) : (isPopular ? -4 : 4);
        const satDelta = Math.round(baseSatDelta * demoMultiplier);
        return {
          ...seat,
          voterSatisfaction: Math.min(100, Math.max(0, seat.voterSatisfaction + satDelta)),
          currentTurnoutPercent: Math.min(100, Math.max(0, seat.currentTurnoutPercent + (isLokSabhaPassed ? 0.2 : -0.1))),
        };
      }
      return seat;
    });

    const summary = isLokSabhaPassed
      ? isPopular
        ? `Passed Lok Sabha with ${totalYes} YES votes (${targetBill.billType || 'ORDINARY'}). Advanced to ${nextStatus}.`
        : `Passed Lok Sabha with ${totalYes} YES votes despite public opposition. Advanced to ${nextStatus}.`
      : `Defeated in Lok Sabha (${totalYes} YES vs ${totalNo} NO). Failed to reach majority threshold.`;

    const updatedBills = state.bills.map((b) =>
      b.id === billId
        ? {
            ...b,
            status: nextStatus,
            quorumSatisfied: true,
            rajyaSabhaPassed,
            presidentialAssentStatus,
            antiDefectionNotices: antiDefectionNotices.length > 0 ? antiDefectionNotices : undefined,
            votes: {
              yesPartyIds: yesParties,
              noPartyIds: noParties,
              abstainPartyIds: abstainParties,
              totalYesSeats: totalYes,
              totalNoSeats: totalNo,
              totalAbstainSeats: totalAbstain,
            },
            publicReaction: {
              nationalApprovalDelta,
              partyPopularityDeltas,
              summary,
              isPopular,
            },
          }
        : b
    );

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `${isLokSabhaPassed ? '✅ PASSED LOK SABHA' : '❌ DEFEATED'}: Floor Vote on '${targetBill.title}'`,
      content: `Result: ${totalYes} YES, ${totalNo} NO, ${totalAbstain} ABSTAIN (Quorum Satisfied: 55+ MPs). ${summary}`,
      snippet: `Result: ${totalYes} YES, ${totalNo} NO, ${totalAbstain} ABSTAIN (Quorum Satisfied: 55+ MPs). ${summary}`,
      author: 'Lok Sabha Speaker Desk',
      source: 'Lok Sabha Speaker Desk',
      category: 'PARLIAMENT',
      bias: 'NEUTRAL',
      sentiment: isLokSabhaPassed ? 'POSITIVE' : 'NEGATIVE',
      affectedPartyIds: [targetBill.proposerPartyId],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      success: true,
      state: {
        ...state,
        governmentApproval: newGovtApproval,
        parties: updatedParties,
        seats: updatedSeats,
        bills: updatedBills,
        articles: [newsArticle, ...state.articles],
      },
      message: `Floor vote processed. Bill status: ${nextStatus}`,
    };
  }

  /**
   * Speaker Certification of Article 110 Money Bill
   */
  static certifyMoneyBillBySpeaker(state, billId) {
    const billIndex = state.bills.findIndex((b) => b.id === billId);
    if (billIndex === -1) {
      return { success: false, state, message: 'Bill not found.' };
    }

    const bill = state.bills[billIndex];
    if (bill.category !== 'TAXATION' && bill.category !== 'ECONOMIC' && bill.category !== 'WELFARE') {
      return {
        success: false,
        state,
        message: 'Speaker Certification Rejected: Under Article 110 of the Constitution of India, only bills pertaining to Taxation, Borrowing, or Consolidated Fund Appropriations qualify as Money Bills.',
      };
    }

    const updatedBills = state.bills.map((b) =>
      b.id === billId
        ? {
            ...b,
            billType: 'MONEY',
            isMoneyBillCertifiedBySpeaker: true,
            rajyaSabhaDaysRemaining: 14,
          }
        : b
    );

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `📜 SPEAKER CERTIFICATION: '${bill.title}' Certified as Article 110 Money Bill`,
      content: `The Speaker of Lok Sabha has officially certified '${bill.title}' as a Money Bill under Article 110. Rajya Sabha has 14 days to recommend changes.`,
      snippet: `Speaker certifies '${bill.title}' as Article 110 Money Bill. Rajya Sabha 14-day window active.`,
      author: 'Lok Sabha Secretariat',
      source: 'Lok Sabha Secretariat',
      category: 'PARLIAMENT',
      bias: 'NEUTRAL',
      sentiment: 'NEUTRAL',
      affectedPartyIds: [bill.proposerPartyId],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      success: true,
      state: {
        ...state,
        bills: updatedBills,
        articles: [newsArticle, ...state.articles],
      },
      message: `Speaker certified "${bill.title}" as an Article 110 Money Bill.`,
    };
  }

  /**
   * Move Special Parliamentary Motion
   */
  static moveSpecialParliamentaryMotion(state, motionType, movedByPartyId) {
    const partySeats = {};
    state.parties.forEach((p) => (partySeats[p.id] = 0));
    state.seats.forEach((seat) => {
      partySeats[seat.leadingPartyId] = (partySeats[seat.leadingPartyId] || 0) + 1;
    });

    let yesSeats = 0;
    let noSeats = 0;

    state.parties.forEach((p) => {
      const isGovtAlliance = p.id === state.governingPartyId || p.allianceId === 'nda';
      const seatsCount = partySeats[p.id] || 0;

      if (motionType === 'NO_CONFIDENCE' || motionType === 'CUT_MOTION') {
        if (isGovtAlliance) noSeats += seatsCount;
        else yesSeats += seatsCount;
      } else {
        if (isGovtAlliance) yesSeats += seatsCount;
        else noSeats += seatsCount;
      }
    });

    const isPassed = yesSeats >= 272;

    let headline = '';
    let content = '';
    let newApproval = state.governmentApproval;

    if (motionType === 'NO_CONFIDENCE') {
      headline = isPassed
        ? `⚠️ GOVERNMENT COLLAPSE: No-Confidence Motion PASSED in Lok Sabha (${yesSeats} vs ${noSeats})`
        : `🏛️ LOK SABHA VOTE: No-Confidence Motion DEFEATED (${yesSeats} YES vs ${noSeats} NO)`;
      content = isPassed
        ? `The Opposition successfully passed the No-Confidence Motion with ${yesSeats} votes. Union Cabinet must resign or call fresh snap elections!`
        : `The Government defeated the No-Confidence Motion with ${noSeats} votes, demonstrating majority stability in Parliament.`;
      newApproval = isPassed ? 15 : Math.min(100, state.governmentApproval + 5);
    } else {
      headline = isPassed
        ? `✂️ CUT MOTION PASSED: Treasury Appropriations Restricted (${yesSeats} YES)`
        : `🏛️ CUT MOTION DEFEATED: Budget Demands Approved (${noSeats} NO)`;
      content = `Floor tally: ${yesSeats} YES vs ${noSeats} NO on budget appropriation cut.`;
      newApproval = isPassed ? Math.max(10, state.governmentApproval - 8) : state.governmentApproval;
    }

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline,
      content,
      snippet: content,
      author: 'Parliamentary Reporter',
      source: 'Parliamentary Reporter',
      category: 'PARLIAMENT',
      bias: 'NEUTRAL',
      sentiment: isPassed ? 'NEGATIVE' : 'POSITIVE',
      affectedPartyIds: [state.governingPartyId, movedByPartyId],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      success: true,
      state: {
        ...state,
        governmentApproval: newApproval,
        articles: [newsArticle, ...state.articles],
      },
      message: `${motionType} processed. Result: ${isPassed ? 'PASSED' : 'DEFEATED'} (${yesSeats} YES vs ${noSeats} NO).`,
    };
  }

  /**
   * Presidential Assent Process
   */
  static processPresidentialAssent(state, billId, action) {
    const billIndex = state.bills.findIndex((b) => b.id === billId);
    if (billIndex === -1) {
      return { success: false, state, message: 'Bill not found.' };
    }

    const bill = state.bills[billIndex];

    if (bill.billType === 'MONEY' && action === 'RETURNED') {
      return {
        success: false,
        state,
        message:
          'Constitutional Violation (Article 111): Under Article 111 of the Constitution of India, the President cannot return a Money Bill to Parliament for reconsideration. The President can only Grant Assent or Withhold Assent.',
      };
    }

    let newStatus = 'ENACTED';

    if (action === 'GRANTED') newStatus = 'ENACTED';
    else if (action === 'WITHHELD') newStatus = 'REJECTED';
    else if (action === 'RETURNED') newStatus = 'DEBATE';

    const updatedBills = state.bills.map((b) =>
      b.id === billId
        ? {
            ...b,
            status: newStatus,
            presidentialAssentStatus: action,
          }
        : b
    );

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `🏛️ PRESIDENTIAL ACTION: '${bill.title}' Assent ${action}`,
      content: `The President of India has ${action} assent for '${bill.title}'. Final Status: ${newStatus}.`,
      snippet: `The President of India has ${action} assent for '${bill.title}'. Final Status: ${newStatus}.`,
      author: 'Rashtrapati Bhavan Wire',
      source: 'Rashtrapati Bhavan Wire',
      category: 'PARLIAMENT',
      bias: 'NEUTRAL',
      sentiment: action === 'GRANTED' ? 'POSITIVE' : 'NEGATIVE',
      affectedPartyIds: [bill.proposerPartyId],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      success: true,
      state: {
        ...state,
        bills: updatedBills,
        articles: [newsArticle, ...state.articles],
      },
      message: `Presidential assent ${action}. Bill status is now ${newStatus}.`,
    };
  }

  /**
   * Emergency Crisis Response
   */
  static processCrisisResponse(state, eventId, choiceId) {
    const evt = state.events.find((e) => e.id === eventId);
    if (!evt || !evt.choices) {
      return { success: false, state, message: 'Anti-Cheat Error: Crisis event ID not found.' };
    }

    const choice = evt.choices.find((c) => c.id === choiceId);
    if (!choice) {
      return { success: false, state, message: 'Anti-Cheat Error: Choice ID not valid.' };
    }

    const govtParty = state.parties.find((p) => p.id === state.governingPartyId);
    if (choice.costCrores > 0 && govtParty && govtParty.fundsInCrores < choice.costCrores) {
      return { success: false, state, message: `Anti-Cheat Warning: Insufficient Treasury Funds (Required: ₹${choice.costCrores} Cr, Available: ₹${govtParty.fundsInCrores} Cr)` };
    }

    const updatedParties = state.parties.map((p) => {
      let delta = 0;
      if (p.id === state.governingPartyId) {
        delta = choice.approvalDelta;
      } else if (choice.approvalDelta < 0) {
        delta = Math.abs(choice.approvalDelta) * 0.4;
      }
      return {
        ...p,
        fundsInCrores: p.id === state.governingPartyId ? Math.max(0, p.fundsInCrores - choice.costCrores) : p.fundsInCrores,
        approvalRating: Math.min(100, Math.max(0, p.approvalRating + Math.round(delta))),
      };
    });

    const newApproval = Math.min(100, Math.max(0, state.governmentApproval + choice.approvalDelta));

    const nextStatePopularity = { ...state.statePopularity };
    if (evt.affectedStates && evt.affectedStates.length > 0) {
      evt.affectedStates.forEach((st) => {
        if (!nextStatePopularity[st]) nextStatePopularity[st] = {};
        nextStatePopularity[st][state.governingPartyId] = Math.min(
          100,
          Math.max(0, (nextStatePopularity[st][state.governingPartyId] || 45) + choice.statePopularityDelta)
        );
      });
    }

    const updatedSeats = state.seats.map((seat) => {
      if (evt.affectedStates?.includes(seat.state)) {
        const satChange = choice.approvalDelta >= 0 ? 8 : -12;
        return {
          ...seat,
          voterSatisfaction: Math.min(100, Math.max(0, seat.voterSatisfaction + satChange)),
        };
      }
      return seat;
    });

    const updatedEvents = state.events.map((e) =>
      e.id === eventId ? { ...e, status: choice.id === 'delay-ignore' ? 'IGNORED' : 'RESOLVED', chosenChoiceId: choiceId } : e
    );

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `🏛️ GOVT CRISIS DIRECTIVE: Executive Policy Issued for '${evt.title}'`,
      content: `Directive: "${choice.title}". ${choice.publicReactionNote} Budget Outlay: ₹${choice.costCrores} Cr.`,
      author: 'Cabinet Secretariat Desk',
      bias: choice.approvalDelta >= 0 ? 'PRO_GOVT' : 'CRITICAL',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      success: true,
      state: {
        ...state,
        governmentApproval: newApproval,
        parties: updatedParties,
        statePopularity: nextStatePopularity,
        seats: updatedSeats,
        events: updatedEvents,
        articles: [newsArticle, ...state.articles],
      },
      message: `Executive Choice Authorized: ${choice.title}`,
    };
  }

  /**
   * Process MP Work
   */
  static processMPWork(state, seatId, category, title, costCrores, partyId) {
    const party = state.parties.find((p) => p.id === partyId);
    if (!party) {
      return { success: false, state, message: 'Anti-Cheat Error: Invalid Party ID.' };
    }

    if (party.fundsInCrores < costCrores) {
      return {
        success: false,
        state,
        message: `Anti-Cheat Warning: Insufficient Treasury Funds (Required ₹${costCrores} Cr, Available ₹${party.fundsInCrores} Cr).`,
      };
    }

    const updatedParties = state.parties.map((p) =>
      p.id === partyId ? { ...p, fundsInCrores: Math.max(0, p.fundsInCrores - costCrores) } : p
    );

    const updatedSeats = state.seats.map((seat) => {
      if (seat.id === seatId) {
        const scoreGain = category === 'INFRASTRUCTURE' ? 25 : category === 'HEALTHCARE' ? 20 : category === 'SKILL_CENTER' ? 18 : 15;
        const satGain = category === 'INFRASTRUCTURE' ? 18 : category === 'HEALTHCARE' ? 15 : category === 'SKILL_CENTER' ? 12 : 10;
        const newMargin = Math.min(35, seat.marginPercent + (category === 'INFRASTRUCTURE' ? 2.5 : 1.5));

        return {
          ...seat,
          mpWorkScore: Math.min(100, seat.mpWorkScore + scoreGain),
          voterSatisfaction: Math.min(100, seat.voterSatisfaction + satGain),
          marginPercent: Number(newMargin.toFixed(1)),
          recentWorkDone: [title, ...(seat.recentWorkDone || []).slice(0, 3)],
        };
      }
      return seat;
    });

    const targetSeat = state.seats.find((s) => s.id === seatId);
    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `🏗️ MP Development Project Executed in ${targetSeat?.constituencyName || 'Seat'}`,
      content: `Work Authorized: "${title}". Budget spent ₹${costCrores} Cr.`,
      author: 'State Infrastructure Bureau',
      bias: 'PRO_GOVT',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      success: true,
      state: {
        ...state,
        parties: updatedParties,
        seats: updatedSeats,
        articles: [newsArticle, ...state.articles],
      },
      message: `MP Development Work executed in ${targetSeat?.constituencyName}.`,
    };
  }

  /**
   * Server Simulation Tick
   */
  static processSimulationTick(state) {
    let currentApproval = state.governmentApproval;
    const nextStatePopularity = { ...state.statePopularity };

    state.events.forEach((evt) => {
      if ((evt.status === 'PENDING_RESPONSE' || evt.status === 'IGNORED') && evt.affectedStates && evt.affectedStates.length > 0) {
        const decay = evt.status === 'IGNORED' ? 0.8 : 0.3;
        currentApproval = Math.max(15, Number((currentApproval - decay * 0.2).toFixed(1)));

        evt.affectedStates.forEach((st) => {
          if (!nextStatePopularity[st]) nextStatePopularity[st] = {};
          nextStatePopularity[st][state.governingPartyId] = Math.max(
            15,
            Number(((nextStatePopularity[st][state.governingPartyId] || 45) - decay).toFixed(1))
          );
        });
      }
    });

    let updatedEvents = [...state.events];
    let updatedArticles = [...state.articles];

    if (Math.random() < 0.05) {
      const randIndex = Math.floor(Math.random() * CRISIS_EVENT_TEMPLATES.length);
      const template = CRISIS_EVENT_TEMPLATES[randIndex];

      const newEvt = {
        ...template,
        id: `evt-${Date.now()}`,
        status: 'PENDING_RESPONSE',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      updatedEvents = [newEvt, ...updatedEvents];

      updatedArticles = [
        {
          id: `news-${Date.now()}`,
          headline: `🚨 EMERGENCY ALERT: ${template.title}`,
          content: `${template.description} Union Cabinet convened for emergency response choices.`,
          author: 'National Press Bureau',
          bias: 'NEUTRAL',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...updatedArticles,
      ];
    }

    const updatedBills = state.bills.map((b) => {
      if (b.status === 'RAJYA_SABHA_VOTE' && b.billType === 'MONEY') {
        const daysLeft = (b.rajyaSabhaDaysRemaining ?? 14) - 1;
        if (daysLeft <= 0) {
          updatedArticles = [
            {
              id: `news-${Date.now()}`,
              headline: `📜 CONSTITUTIONAL ENACTMENT (Article 109/110): Money Bill '${b.title}' Passed`,
              content: `The 14-day recommendation period for Rajya Sabha expired. Under Article 109(5), '${b.title}' is deemed passed by both Houses and sent for Presidential Assent.`,
              snippet: `14-day RS window expired. Money Bill '${b.title}' deemed passed by Parliament under Article 109(5).`,
              author: 'Rajya Sabha Secretariat',
              source: 'Rajya Sabha Secretariat',
              category: 'PARLIAMENT',
              bias: 'NEUTRAL',
              sentiment: 'POSITIVE',
              affectedPartyIds: [b.proposerPartyId],
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            ...updatedArticles,
          ];
          return {
            ...b,
            status: 'PRESIDENTIAL_ASSENT',
            rajyaSabhaPassed: true,
            presidentialAssentStatus: 'PENDING',
            rajyaSabhaDaysRemaining: 0,
          };
        }
        return { ...b, rajyaSabhaDaysRemaining: daysLeft };
      }

      if (b.status === 'ENACTED') {
        const isCostly = b.effects.treasuryCostCrores >= 400;
        const isDamaging = b.effects.environment < -10;
        if (isCostly || isDamaging) {
          const shift = isCostly && isDamaging ? -0.3 : -0.15;
          currentApproval = Math.max(10, Number((currentApproval + shift * 0.1).toFixed(1)));
          return {
            ...b,
            evolvingSentimentTrend: Number(((b.evolvingSentimentTrend || 0) + shift).toFixed(2)),
          };
        }
      }

      return b;
    });

    const updatedParties = state.parties.map((p) => ({
      ...p,
      politicalCapital: Math.min(100, (p.politicalCapital ?? 100) + 5),
    }));

    let nextState = {
      ...state,
      governmentApproval: currentApproval,
      statePopularity: nextStatePopularity,
      bills: updatedBills,
      parties: updatedParties,
      events: updatedEvents,
      articles: updatedArticles,
    };

    // Trigger Anti-Incumbency calculations
    nextState = PoliticalMechanicsEngine.processAntiIncumbency(nextState);

    // Trigger AI Agents if enabled
    if (state.aiChiefJusticeEnabled !== false) {
      nextState = ChiefJusticeAIAgent.processPetitions(nextState);
    }

    if (state.aiECIEnabled !== false) {
      nextState = ElectionCommissionAIAgent.processECITasks(nextState);
    }

    return nextState;
  }

  /**
   * Evaluate National 543 Seat Tally & Automatically Change Prime Minister (PM)
   */
  static evaluatePMTransition(state) {
    const partySeatsTally = {};
    state.seats.forEach((seat) => {
      let winningParty = seat.winnerPartyId || seat.leadingPartyId || 'bjp';
      if (seat.votesMap && Object.keys(seat.votesMap).length > 0) {
        let maxVotes = -1;
        Object.entries(seat.votesMap).forEach(([pId, vCount]) => {
          if (vCount > maxVotes) {
            maxVotes = vCount;
            winningParty = pId;
          }
        });
      }
      partySeatsTally[winningParty] = (partySeatsTally[winningParty] || 0) + 1;
    });

    const updatedParties = state.parties.map((p) => ({
      ...p,
      seatsWon: partySeatsTally[p.id] || 0,
    }));

    let topPartyId = state.governingPartyId || 'bjp';
    let maxSeats = -1;

    Object.entries(partySeatsTally).forEach(([pId, count]) => {
      if (count > maxSeats) {
        maxSeats = count;
        topPartyId = pId;
      }
    });

    const topPartyObj = updatedParties.find((p) => p.id === topPartyId) || updatedParties[0];
    const isPMChanged = state.governingPartyId !== topPartyId;

    const newPMLeaderName = topPartyObj.leader && !topPartyObj.leader.includes('[Vacant')
      ? topPartyObj.leader
      : `${topPartyObj.shortName} Leader`;

    let updatedArticles = [...(state.articles || [])];

    if (isPMChanged) {
      const announcementHeadline = `👑 PRIME MINISTER TRANSITION: ${topPartyObj.name} (${topPartyObj.shortName}) Claims Majority with ${maxSeats} Lok Sabha Seats!`;
      const announcementContent = `Constituency vote tally update across 543 Lok Sabha seats! ${topPartyObj.name} has emerged as the leading party with ${maxSeats} seats. ${newPMLeaderName} is officially appointed Prime Minister of India by Rashtrapati Bhavan.`;

      updatedArticles.unshift({
        id: `news-pm-${Date.now()}`,
        headline: announcementHeadline,
        content: announcementContent,
        author: 'RASHTRAPATI BHAVAN / ECI GAZETTE',
        bias: 'NEUTRAL',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    return {
      ...state,
      parties: updatedParties,
      governingPartyId: topPartyId,
      primeMinisterDetails: {
        pmName: newPMLeaderName,
        pmPartyId: topPartyId,
        pmPartyName: topPartyObj.name,
        pmPartyShort: topPartyObj.shortName,
        totalSeatsWon: maxSeats,
        appointedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      articles: updatedArticles,
    };
  }

  /**
   * Cast/Simulate Direct Constituency Votes & Store Votes per Constituency
   */
  static castVoteInConstituency(state, seatId, partyId, voteCount = 10000) {
    const seatIndex = state.seats.findIndex((s) => s.id === seatId);
    if (seatIndex === -1) return { success: false, state, message: 'Seat not found.' };

    const targetSeat = state.seats[seatIndex];
    const currentVotesMap = targetSeat.votesMap || {
      [targetSeat.leadingPartyId || 'bjp']: 120000,
      [targetSeat.runnerUpPartyId || 'inc']: 95000,
    };

    const updatedVotesMap = {
      ...currentVotesMap,
      [partyId]: (currentVotesMap[partyId] || 0) + Number(voteCount),
    };

    let winningPartyId = partyId;
    let maxVotes = -1;
    Object.entries(updatedVotesMap).forEach(([pId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        winningPartyId = pId;
      }
    });

    const partyObj = state.parties.find((p) => p.id === partyId);

    const updatedSeats = state.seats.map((seat) => {
      if (seat.id === seatId) {
        return {
          ...seat,
          votesMap: updatedVotesMap,
          leadingPartyId: winningPartyId,
          winnerPartyId: winningPartyId,
          totalVotesCast: Object.values(updatedVotesMap).reduce((a, b) => a + b, 0),
          voterSatisfaction: Math.min(100, seat.voterSatisfaction + 2),
        };
      }
      return seat;
    });

    let newState = {
      ...state,
      seats: updatedSeats,
    };

    newState = ServerGameEngine.evaluatePMTransition(newState);

    const newsArticle = {
      id: `news-vote-${Date.now()}`,
      headline: `🗳️ CONSTITUENCY EVM VOTE POST: +${Number(voteCount).toLocaleString()} Votes Posted for ${partyObj?.shortName || partyId.toUpperCase()} in ${targetSeat.constituencyName}`,
      content: `Official vote tally updated in ${targetSeat.constituencyName} (${targetSeat.state}). Current leading party: ${winningPartyId.toUpperCase()}. Total votes stored: ${Object.values(updatedVotesMap).reduce((a, b) => a + b, 0).toLocaleString()}.`,
      author: 'Constituency Returning Officer',
      bias: 'NEUTRAL',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    newState.articles = [newsArticle, ...(newState.articles || [])];

    return {
      success: true,
      state: newState,
      message: `Cast & stored +${Number(voteCount).toLocaleString()} votes for ${partyObj?.shortName || partyId.toUpperCase()} in ${targetSeat.constituencyName}. Winning: ${winningPartyId.toUpperCase()}!`,
    };
  }

  /**
   * Post Bulk EVM Vote Totals to a Constituency & Auto-Update Seat & PM
   */
  static postEVMVotesToConstituency(state, seatId, partyVotesObject) {
    const seatIndex = state.seats.findIndex((s) => s.id === seatId);
    if (seatIndex === -1) return { success: false, state, message: 'Seat not found.' };

    const targetSeat = state.seats[seatIndex];
    const currentVotesMap = targetSeat.votesMap || {};

    const updatedVotesMap = { ...currentVotesMap };
    Object.entries(partyVotesObject).forEach(([pId, count]) => {
      updatedVotesMap[pId] = (updatedVotesMap[pId] || 0) + Number(count);
    });

    let winningPartyId = targetSeat.leadingPartyId;
    let maxVotes = -1;
    Object.entries(updatedVotesMap).forEach(([pId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        winningPartyId = pId;
      }
    });

    const updatedSeats = state.seats.map((seat) => {
      if (seat.id === seatId) {
        return {
          ...seat,
          votesMap: updatedVotesMap,
          leadingPartyId: winningPartyId,
          winnerPartyId: winningPartyId,
          totalVotesCast: Object.values(updatedVotesMap).reduce((a, b) => a + b, 0),
          status: 'DECLARED',
        };
      }
      return seat;
    });

    let newState = {
      ...state,
      seats: updatedSeats,
    };

    newState = ServerGameEngine.evaluatePMTransition(newState);

    return {
      success: true,
      state: newState,
      message: `EVM votes successfully posted and stored for ${targetSeat.constituencyName}! Seat won by ${winningPartyId.toUpperCase()}.`,
    };
  }
}
