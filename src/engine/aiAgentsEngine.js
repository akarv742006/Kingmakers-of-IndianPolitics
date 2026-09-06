/**
 * AI Autonomous Agents Engine for Kingmakers of Indian Politics
 * - ChiefJusticeAIAgent: Autonomous constitutional bench adjudication
 * - ElectionCommissionAIAgent: Autonomous party registration & MCC regulation
 */

export class ChiefJusticeAIAgent {
  /**
   * Process pending Supreme Court petitions autonomously
   */
  static processPetitions(state) {
    if (!state.petitions || state.petitions.length === 0) return state;

    const pending = state.petitions.filter(
      (p) => p.status === 'PENDING' || p.status === 'HEARING'
    );
    if (pending.length === 0) return state;

    // Process 1 petition per cycle for realistic judicial pace
    const targetPetition = pending[0];

    const rand = Math.random();
    let verdictType = 'DISMISSED';
    let rulingNote = '';

    if (targetPetition.category === 'MCC_VIOLATION') {
      if (rand > 0.4) {
        verdictType = 'WARNING_ISSUED';
        rulingNote = `Supreme Court Bench finds prima facie evidence of Model Code of Conduct breach by ${targetPetition.respondent}. Party instructed to retract inflammatory campaign material within 24 hours under RPA Section 123.`;
      } else {
        verdictType = 'DISMISSED';
        rulingNote = `Petition dismissed. Supreme Court holds that speech falls within constitutional right to free political expression under Article 19(1)(a).`;
      }
    } else if (targetPetition.category === 'ANTI_DEFECTION') {
      if (rand > 0.35) {
        verdictType = 'ALLOWED';
        rulingNote = `Constitutional Bench upholds 10th Schedule principles. Speaker directed to decide defection petition within 14 days without partisan delay.`;
      } else {
        verdictType = 'DISMISSED';
        rulingNote = `Dismissed on grounds of premature judicial intervention prior to Speaker's formal order (Kihoto Hollohan precedent).`;
      }
    } else if (targetPetition.category === 'BILL_CONSTITUTIONALITY') {
      if (rand > 0.6) {
        verdictType = 'STAY_GRANTED';
        rulingNote = `Interim stay granted on enforcement of contested legislative clause. State directed to file counter-affidavit within 3 weeks.`;
      } else {
        verdictType = 'DISMISSED';
        rulingNote = `Presumption of constitutionality applies. Parliament holds sovereign competence to enact statutory policy.`;
      }
    } else {
      verdictType = rand > 0.5 ? 'ALLOWED' : 'DISMISSED';
      rulingNote = `Constitutional Order delivered by Supreme Court Bench presided over by Chief Justice of India.`;
    }

    const updatedPetitions = state.petitions.map((p) => {
      if (p.id === targetPetition.id) {
        return {
          ...p,
          status: 'VERDICT_DELIVERED',
          verdict: verdictType,
          judgeNote: rulingNote,
          resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return p;
    });

    const newsArticle = {
      id: `news-sc-${Date.now()}`,
      headline: `⚖️ SUPREME COURT AI RULING: Verdict in ${targetPetition.subject}`,
      content: `Chief Justice Bench delivered verdict (${verdictType}) in Writ Petition #${targetPetition.id} (${targetPetition.petitioner} vs ${targetPetition.respondent}). RULING: ${rulingNote}`,
      snippet: `Supreme Court CJ Bench ruled: ${verdictType}. ${rulingNote}`,
      author: 'Supreme Court Secretariat / Press Bureau',
      source: 'Supreme Court Secretariat',
      category: 'JUDICIARY',
      bias: 'NEUTRAL',
      sentiment: verdictType === 'STAY_GRANTED' || verdictType === 'WARNING_ISSUED' ? 'NEGATIVE' : 'NEUTRAL',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return {
      ...state,
      petitions: updatedPetitions,
      articles: [newsArticle, ...(state.articles || [])],
    };
  }
}

export class ElectionCommissionAIAgent {
  /**
   * Process pending party registrations & MCC monitoring autonomously
   */
  static processECITasks(state) {
    let currentState = { ...state };
    let newsAdded = [];

    // 1. Process Party Applications
    if (currentState.customApplications && currentState.customApplications.length > 0) {
      const pendingApps = currentState.customApplications.filter((a) => a.status === 'PENDING');

      if (pendingApps.length > 0) {
        const app = pendingApps[0];
        const isApproved = Math.random() > 0.25; // 75% approval rate
        const status = isApproved ? 'APPROVED' : 'REJECTED';
        const comment = isApproved
          ? 'Registered under Section 29A of Representation of the People Act 1951. Party Symbol allocated.'
          : 'Rejected due to similarity with existing registered symbol or non-compliance with affidavit norms.';

        const updatedApps = currentState.customApplications.map((a) =>
          a.id === app.id ? { ...a, status, eciComment: comment } : a
        );

        let updatedParties = [...currentState.parties];
        if (isApproved) {
          const newPartyObj = {
            id: app.id,
            name: app.partyName,
            shortName: app.shortName,
            symbol: app.symbol,
            color: app.color || '#10b981',
            fundsInCrores: 120,
            politicalCapital: 100,
            ideology: app.ideology || 'Centrist Development',
            manifestoPromises: app.manifestoPromises || ['Constitutional Governance', 'Economic Growth'],
            leaderName: app.leaderName || 'Party Founder',
          };
          updatedParties.push(newPartyObj);
        }

        newsAdded.push({
          id: `news-eci-${Date.now()}`,
          headline: `🛡️ ECI AI DECISION: ${app.partyName} Registration ${status}`,
          content: `Election Commission of India reviewed application for ${app.partyName} (${app.shortName}). Status: ${status}. ECI Rationale: ${comment}`,
          snippet: `ECI ${status} ${app.partyName} registration request.`,
          author: 'Nirvachan Sadan ECI Bureau',
          source: 'Nirvachan Sadan ECI Bureau',
          category: 'ELECTIONS',
          bias: 'NEUTRAL',
          sentiment: isApproved ? 'POSITIVE' : 'NEGATIVE',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        currentState = {
          ...currentState,
          customApplications: updatedApps,
          parties: updatedParties,
        };
      }
    }

    // 2. Automated MCC Compliance Advisory
    if (Math.random() < 0.08) {
      const randomParty = currentState.parties[Math.floor(Math.random() * currentState.parties.length)];
      if (randomParty) {
        newsAdded.push({
          id: `news-mcc-${Date.now()}`,
          headline: `📢 ECI MCC NOTICE: Advisory Issued to ${randomParty.shortName}`,
          content: `The Election Commission has issued a formal Model Code of Conduct (MCC) advisory to ${randomParty.name} regarding campaign expenditure monitoring and rally speech guidelines.`,
          snippet: `ECI issues MCC advisory to ${randomParty.shortName}.`,
          author: 'ECI Election Bureau',
          source: 'ECI Secretariat',
          category: 'ELECTIONS',
          bias: 'NEUTRAL',
          sentiment: 'NEUTRAL',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    }

    if (newsAdded.length > 0) {
      currentState = {
        ...currentState,
        articles: [...newsAdded, ...(currentState.articles || [])],
      };
    }

    return currentState;
  }
}
