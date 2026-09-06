/**
 * Political Mechanics Engine for Kingmakers of Indian Politics
 * - Daily Salaries by Post/Ministry
 * - Enacted Bill Policy Execution
 * - Anti-Incumbency Decay Engine
 * - Party Split Mechanism (10th Schedule Anti-Defection Rule)
 * - Party Merger System
 * - By-Elections Manager
 * - 3rd Force Swing Voter Dynamics
 */

export class PoliticalMechanicsEngine {
  /**
   * Calculate daily salary by role / ministry portfolio
   */
  static getDailySalary(role) {
    switch (role) {
      case 'prime_minister':
        return { postTitle: 'Prime Minister of India', dailyAmountLakhs: 15, dailyFundsCrores: 0.15 };
      case 'chief_minister':
        return { postTitle: 'Chief Minister', dailyAmountLakhs: 10, dailyFundsCrores: 0.10 };
      case 'minister':
        return { postTitle: 'Union Cabinet Minister', dailyAmountLakhs: 5, dailyFundsCrores: 0.05 };
      case 'president':
        return { postTitle: 'President of India (Rashtrapati)', dailyAmountLakhs: 5, dailyFundsCrores: 0.05 };
      case 'governor':
        return { postTitle: 'State Governor (Raj Bhavan)', dailyAmountLakhs: 3, dailyFundsCrores: 0.03 };
      case 'judge':
        return { postTitle: 'Chief Justice / SC Judge', dailyAmountLakhs: 2, dailyFundsCrores: 0.02 };
      case 'eci':
        return { postTitle: 'Chief Election Commissioner', dailyAmountLakhs: 2, dailyFundsCrores: 0.02 };
      case 'politician':
      default:
        return { postTitle: 'Member of Parliament (MP)', dailyAmountLakhs: 1, dailyFundsCrores: 0.01 };
    }
  }

  /**
   * Enacted Bill Policy Execution
   */
  static executeEnactedBillPolicy(state, bill) {
    if (!bill || bill.status !== 'ENACTED') return state;

    let updatedSeats = [...state.seats];
    let updatedParties = [...state.parties];
    let newGovtApproval = state.governmentApproval;

    // Apply policy effects based on bill category & effects
    const category = bill.category || 'GENERAL';
    const effects = bill.effects || {};

    if (category === 'INFRASTRUCTURE' || category === 'ECONOMY') {
      newGovtApproval = Math.min(100, newGovtApproval + 4);
      updatedSeats = updatedSeats.map((seat) => {
        if (!bill.targetStates || bill.targetStates.length === 0 || bill.targetStates.includes(seat.state)) {
          return {
            ...seat,
            mpWorkScore: Math.min(100, seat.mpWorkScore + 12),
            voterSatisfaction: Math.min(100, seat.voterSatisfaction + 8),
          };
        }
        return seat;
      });
    } else if (category === 'AGRICULTURE' || category === 'WELFARE') {
      newGovtApproval = Math.min(100, newGovtApproval + 6);
      updatedSeats = updatedSeats.map((seat) => ({
        ...seat,
        voterSatisfaction: Math.min(100, seat.voterSatisfaction + 10),
      }));
    } else if (category === 'LAW_AND_ORDER' || category === 'CORRUPTION') {
      newGovtApproval = Math.min(100, newGovtApproval + 5);
    }

    const newsArticle = {
      id: `news-policy-${Date.now()}`,
      headline: `📜 LEGISLATION ENACTED IN GAZETTE: '${bill.title}' Implemented Across India`,
      content: `The Gazette notification for '${bill.title}' has been issued following Presidential Assent. Statutory policy implementation has begun across parliamentary constituencies.`,
      snippet: `'${bill.title}' implemented in Gazette of India.`,
      author: 'Gazette of India Secretariat',
      source: 'Ministry of Law & Justice',
      category: 'PARLIAMENT',
      bias: 'NEUTRAL',
      sentiment: 'POSITIVE',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      ...state,
      governmentApproval: newGovtApproval,
      seats: updatedSeats,
      parties: updatedParties,
      articles: [newsArticle, ...(state.articles || [])],
    };
  }

  /**
   * Anti-Incumbency Decay Engine
   */
  static processAntiIncumbency(state) {
    const governingPartyId = state.governingPartyId || 'bjp';

    const updatedSeats = state.seats.map((seat) => {
      if (seat.leadingPartyId === governingPartyId) {
        // High anti-incumbency if MP work score or voter satisfaction is low
        const isLowPerformance = (seat.mpWorkScore || 40) < 45 || (seat.voterSatisfaction || 50) < 50;
        if (isLowPerformance) {
          const decayMargin = Math.max(0.5, Number((seat.marginPercent - 0.4).toFixed(1)));
          const decaySat = Math.max(10, Number((seat.voterSatisfaction - 0.3).toFixed(1)));
          return {
            ...seat,
            marginPercent: decayMargin,
            voterSatisfaction: decaySat,
          };
        }
      }
      return seat;
    });

    return {
      ...state,
      seats: updatedSeats,
    };
  }

  /**
   * Party Split Mechanism (10th Schedule Anti-Defection Rule)
   */
  static processPartySplit(state, sourcePartyId, splittingMemberCount, newPartyName, newShortName, newSymbol) {
    const sourceParty = state.parties.find((p) => p.id === sourcePartyId);
    if (!sourceParty) {
      return { success: false, state, message: 'Source party not found.' };
    }

    const sourcePartySeats = state.seats.filter((s) => s.leadingPartyId === sourcePartyId);
    const totalPartySeats = sourcePartySeats.length || 10;
    const fraction = splittingMemberCount / totalPartySeats;

    // Check 2/3rd threshold under 10th Schedule Paragraph 4
    if (fraction < 0.666) {
      // Violates Anti-Defection Law! Automatic Supreme Court Petition
      const petition = {
        id: `pet-split-${Date.now()}`,
        petitioner: sourceParty.name,
        respondent: `${splittingMemberCount} Defecting MPs / Faction`,
        subject: `Anti-Defection Disqualification Petition against ${splittingMemberCount} MPs under 10th Schedule`,
        category: 'ANTI_DEFECTION',
        details: `Faction of ${splittingMemberCount} MPs (${(fraction * 100).toFixed(1)}% of party strength) attempted split without required 2/3rd statutory strength (${Math.ceil(totalPartySeats * 0.666)} MPs required). Speaker disqualification requested.`,
        status: 'PENDING',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const newsArticle = {
        id: `news-defection-${Date.now()}`,
        headline: `🚨 FACTION DEFECTION ATTEMPT: Anti-Defection Petition Filed against ${splittingMemberCount} ${sourceParty.shortName} MPs`,
        content: `A rebellious faction of ${splittingMemberCount} MPs in ${sourceParty.name} attempted a party split, failing the 2/3rd Anti-Defection threshold under Tenth Schedule. Disqualification petition filed in Supreme Court.`,
        author: 'Parliamentary Legal Desk',
        category: 'JUDICIARY',
        bias: 'NEUTRAL',
        sentiment: 'NEGATIVE',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      return {
        success: false,
        state: {
          ...state,
          petitions: [petition, ...(state.petitions || [])],
          articles: [newsArticle, ...(state.articles || [])],
        },
        message: `Split Faction has only ${(fraction * 100).toFixed(1)}% strength (< 2/3rd requirement of ${Math.ceil(totalPartySeats * 0.666)} MPs). Anti-defection petition filed in Supreme Court!`,
      };
    }

    // Valid 2/3rd Constitutional Split Exception
    const newPartyId = `party-split-${Date.now()}`;
    const newParty = {
      id: newPartyId,
      name: newPartyName || `${sourceParty.name} (Real Faction)`,
      shortName: newShortName || `${sourceParty.shortName}-R`,
      symbol: newSymbol || '⚡',
      color: '#f59e0b',
      ideology: sourceParty.ideology || 'Centrist',
      leaderName: 'Split Faction Leader',
      fundsInCrores: Math.floor((sourceParty.fundsInCrores || 1000) * 0.35),
      politicalCapital: 80,
      approvalRating: 40,
      manifestoPromises: sourceParty.manifestoPromises || ['Real Party Principles', 'Development'],
    };

    // Transfer split seats to new party
    let seatsTransferred = 0;
    const updatedSeats = state.seats.map((seat) => {
      if (seat.leadingPartyId === sourcePartyId && seatsTransferred < splittingMemberCount) {
        seatsTransferred++;
        return { ...seat, leadingPartyId: newPartyId };
      }
      return seat;
    });

    const newsArticle = {
      id: `news-split-${Date.now()}`,
      headline: `🏛️ CONSTITUTIONAL PARTY SPLIT: ${newParty.name} Formed by ${splittingMemberCount} MPs`,
      content: `Validating 2/3rd parliamentary strength under Tenth Schedule Paragraph 4, ${splittingMemberCount} MPs have officially recognized ${newParty.name} (${newParty.shortName}) as a distinct political party.`,
      author: 'Lok Sabha Secretariat',
      category: 'PARLIAMENT',
      bias: 'NEUTRAL',
      sentiment: 'POSITIVE',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      success: true,
      state: {
        ...state,
        parties: [...state.parties, newParty],
        seats: updatedSeats,
        articles: [newsArticle, ...(state.articles || [])],
      },
      message: `Party Split Successful! ${newParty.name} legally recognized under 10th Schedule with ${splittingMemberCount} MPs.`,
    };
  }

  /**
   * Party Merger Mechanism
   */
  static processPartyMerger(state, sourcePartyId, targetPartyId) {
    const sourceParty = state.parties.find((p) => p.id === sourcePartyId);
    const targetParty = state.parties.find((p) => p.id === targetPartyId);

    if (!sourceParty || !targetParty) {
      return { success: false, state, message: 'Source or target party not found.' };
    }

    // Merge seats and funds into target party
    const updatedSeats = state.seats.map((seat) =>
      seat.leadingPartyId === sourcePartyId ? { ...seat, leadingPartyId: targetPartyId } : seat
    );

    const mergedFunds = (targetParty.fundsInCrores || 0) + (sourceParty.fundsInCrores || 0);

    const updatedParties = state.parties
      .filter((p) => p.id !== sourcePartyId)
      .map((p) => (p.id === targetPartyId ? { ...p, fundsInCrores: mergedFunds } : p));

    const newsArticle = {
      id: `news-merger-${Date.now()}`,
      headline: `🤝 HISTORIC PARTY MERGER: ${sourceParty.shortName} Merges with ${targetParty.name}`,
      content: `${sourceParty.name} has officially merged its organization, seats, and parliamentary cadre into ${targetParty.name} (${targetParty.shortName}).`,
      author: 'Election Observer Bureau',
      category: 'ELECTIONS',
      bias: 'NEUTRAL',
      sentiment: 'POSITIVE',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      success: true,
      state: {
        ...state,
        parties: updatedParties,
        seats: updatedSeats,
        articles: [newsArticle, ...(state.articles || [])],
      },
      message: `Historic Merger Complete! ${sourceParty.name} merged into ${targetParty.name}.`,
    };
  }

  /**
   * 3rd Element / Swing Voter Calculation
   */
  static calculate3rdElementSwing(state) {
    // 3rd element: Unaligned voters (15-25% chunk)
    const unalignedStrength = 22; // 22% swing voters
    return {
      swingVoterPercentage: unalignedStrength,
      kingmakerAlliance: 'Unaligned Regional & Grassroots Front',
      description: 'Regional Independent Fronts & Neutral Citizen voters controlling crucial swing seats.',
    };
  }
}
