tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#a855f7',
          purpleSoft: '#8b5cf6',
        },
      },
      boxShadow: {
        'soft-xl': '0 40px 120px rgba(0, 0, 0, 0.55)',
      },
      backgroundImage: {
        'grainy-gradient':
          'radial-gradient(circle at top, rgba(168,85,247,0.32), transparent 55%), radial-gradient(circle at bottom, rgba(56,189,248,0.3), transparent 55%), linear-gradient(135deg, #020617, #020617)',
      },
    },
  },
};
