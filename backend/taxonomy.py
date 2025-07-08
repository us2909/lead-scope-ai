
# This first set of rules maps broader themes, usually found in the pain card titles,
# to relevant scope areas. This helps catch more nuanced pain points.
PAIN_THEME_RULES = {
    'competition': ['FIN-CTRL'],  # Intense competition requires cost control & margin analysis
    'market volatility': ['FIN-FPA'],  # Volatility affects forecasting
    'cost management': ['FIN-CTRL'],
    'revenue recognition': ['COM-RAR'],
    'cash flow': ['FIN-TCM'],
    'churn': ['COM-OM'], # Customer churn linked to Order Management
    'forecasting': ['FIN-FPA', 'SCM-DPF'],
}

# This second set of rules provides more granular, specific keyword matches.
# It's good for finding direct references in the pain card blurbs.
KEYWORD_RULES = {
    # Financial Keywords
    'financial data': ['FIN-MDM'],
    'financial reporting': ['FIN-CTRL', 'FIN-FPA'],
    'financial close': ['FIN-CTRL'],
    'closing process': ['FIN-CTRL'],
    'margin': ['FIN-CTRL'],
    'profitability': ['FIN-CTRL'],
    'procure-to-pay': ['FIN-P2P'],
    'cash management': ['FIN-TCM'],
    'treasury': ['FIN-TCM'],
    'invoice': ['COM-INV'],
    'revenue': ['COM-RAR'],

    # Supply Chain & Operations Keywords
    'supply chain': ['SCM-DPF', 'SCM-IM', 'SCM-WMS', 'SCM-TRA'],
    'inventory': ['SCM-IM'],
    'procurement': ['FIN-P2P', 'SCM-DPF'],
    'logistics': ['SCM-TRA', 'SCM-WMS'],
    'transportation': ['SCM-TRA'],
    'warehouse': ['SCM-WMS'],
    'distribution': ['SCM-WMS'],
    'planning': ['OPS-PP', 'SCM-DPF'],
    'manufacturing': ['OPS-EXEC'],
    'production': ['OPS-PP', 'OPS-EXEC'],
    'quality': ['OPS-QM'],
    'asset maintenance': ['OPS-PM'],

    # Customer & Sales Keywords
    'customer': ['COM-OM'],
    'order fulfillment': ['COM-OM'],
    'available-to-promise': ['COM-ATP'],
    'reporting compliance': ['COM-RAR', 'FIN-CTRL'],
    
    # Data Keywords
    'master data': ['FIN-MDM'],
    'inconsistent data': ['FIN-MDM'],
    'fragmented data': ['FIN-MDM'],
}