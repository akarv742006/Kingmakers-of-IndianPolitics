export const getQualitativeIndicator = (value, isUncertain = false) => {
  if (isUncertain) {
    return {
      label: 'Uncertain Impact',
      symbol: '??',
      badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 font-bold',
    };
  }

  if (value >= 35) {
    return {
      label: 'High Positive',
      symbol: '++',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black',
    };
  } else if (value >= 5) {
    return {
      label: 'Moderate Positive',
      symbol: '+',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold',
    };
  } else if (value >= -5) {
    return {
      label: 'Neutral / Mixed',
      symbol: '~',
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-700 font-semibold',
    };
  } else if (value >= -35) {
    return {
      label: 'Moderate Negative',
      symbol: '-',
      badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30 font-bold',
    };
  } else {
    return {
      label: 'High Negative',
      symbol: '--',
      badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40 font-black',
    };
  }
};
