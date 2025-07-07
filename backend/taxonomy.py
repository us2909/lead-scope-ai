# A dictionary of all possible tiles we can show on the grid
# In a real project, this would be much larger.
ALL_SCOPE_TILES = {
    'FI-GL': 'General Ledger',
    'FI-AP': 'Accounts Payable',
    'FI-AR': 'Accounts Receivable',
    'CO-PA': 'Profitability Analysis',
    'EC-CS': 'Consolidation',
    'MM-PUR': 'Procurement',
    'MM-IM': 'Inventory Management',
    'SD-SLS': 'Sales & Distribution',
    'PP-MRP': 'Production Planning',
    'MDG': 'Master Data Governance',
    'HCM-PY': 'Payroll',
    'PM-WOC': 'Maintenance Orders'
}

# The rule engine's logic. Maps a keyword to a list of module IDs.
# The keywords will be searched for in the pain card text.
SCOPE_RULES = {
    # Financial Keywords
    'financial': ['FI-GL', 'FI-AP', 'FI-AR'],
    'close': ['FI-GL', 'EC-CS'],
    'closing': ['FI-GL', 'EC-CS'],
    'ledger': ['FI-GL'],
    'margin': ['CO-PA'],
    'profitability': ['CO-PA'],

    # Logistical Keywords
    'supply chain': ['MM-PUR', 'SD-SLS', 'PP-MRP'],
    'inventory': ['MM-IM'],
    'procurement': ['MM-PUR'],
    'sourcing': ['MM-PUR'],
    'sales': ['SD-SLS'],
    'shipping': ['SD-SLS'],

    # Data Keywords
    'data': ['MDG'],
    'inconsistent': ['MDG'],
}