import { api } from './api';

// Mock data
const mockContracts = [
  {
    id: "c1",
    name: "MSA 2025",
    parties: "Microsoft & ABC Corp",
    expiry: "2025-12-31",
    status: "Active",
    risk: "Medium"
  },
  {
    id: "c2",
    name: "Network Services Agreement",
    parties: "TelNet & ABC Corp",
    expiry: "2025-10-10",
    status: "Renewal Due",
    risk: "High"
  },
  {
    id: "c3",
    name: "Cloud Infrastructure Contract",
    parties: "AWS & ABC Corp",
    expiry: "2026-03-15",
    status: "Active",
    risk: "Low"
  },
  {
    id: "c4",
    name: "Software License Agreement",
    parties: "Adobe & ABC Corp",
    expiry: "2024-08-20",
    status: "Expired",
    risk: "Medium"
  },
  {
    id: "c5",
    name: "Consulting Services Contract",
    parties: "Deloitte & ABC Corp",
    expiry: "2025-11-30",
    status: "Active",
    risk: "Low"
  },
  {
    id: "c6",
    name: "Data Analytics Platform",
    parties: "Tableau & ABC Corp",
    expiry: "2025-09-15",
    status: "Renewal Due",
    risk: "Medium"
  },
  {
    id: "c7",
    name: "Security Services Agreement",
    parties: "CyberSec Inc & ABC Corp",
    expiry: "2026-01-20",
    status: "Active",
    risk: "High"
  }
];

const mockContractDetails = {
  "c1": {
    id: "c1",
    name: "MSA 2025",
    parties: "Microsoft & ABC Corp",
    start: "2023-01-01",
    expiry: "2025-12-31",
    status: "Active",
    risk: "Medium",
    clauses: [
      { title: "Termination", summary: "90 days notice period.", confidence: 0.82 },
      { title: "Liability Cap", summary: "12 months' fees limit.", confidence: 0.87 },
      { title: "Data Protection", summary: "GDPR compliance required.", confidence: 0.91 },
      { title: "Payment Terms", summary: "Net 30 payment terms.", confidence: 0.89 }
    ],
    insights: [
      { risk: "High", message: "Liability cap excludes data breach costs." },
      { risk: "Medium", message: "Renewal auto-renews unless cancelled 60 days before expiry." },
      { risk: "Low", message: "Standard termination clauses are well-defined." }
    ],
    evidence: [
      { source: "Section 12.2", snippet: "Total liability limited to 12 months' fees.", relevance: 0.91 },
      { source: "Section 8.1", snippet: "Either party may terminate with 90 days written notice.", relevance: 0.88 },
      { source: "Section 15.3", snippet: "Agreement automatically renews for successive one-year terms.", relevance: 0.85 }
    ]
  },
  "c2": {
    id: "c2",
    name: "Network Services Agreement",
    parties: "TelNet & ABC Corp",
    start: "2023-10-10",
    expiry: "2025-10-10",
    status: "Renewal Due",
    risk: "High",
    clauses: [
      { title: "Service Level", summary: "99.9% uptime guarantee.", confidence: 0.95 },
      { title: "Payment Terms", summary: "Net 30 payment terms.", confidence: 0.89 },
      { title: "Penalties", summary: "Service credit for downtime.", confidence: 0.92 }
    ],
    insights: [
      { risk: "High", message: "No force majeure clause for network outages." },
      { risk: "High", message: "Penalty clauses may result in significant costs." },
      { risk: "Medium", message: "SLA requirements are aggressive." }
    ],
    evidence: [
      { source: "Section 5.1", snippet: "Service availability shall be maintained at 99.9%.", relevance: 0.93 },
      { source: "Section 7.2", snippet: "Service credits equal to 2% of monthly fees for each hour of downtime.", relevance: 0.89 }
    ]
  }
};

export const contractsService = {
  // Get all contracts with optional filters
  async getContracts(filters = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let filtered = [...mockContracts];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(contract => 
        contract.name.toLowerCase().includes(searchTerm) ||
        contract.parties.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(contract => contract.status === filters.status);
    }

    if (filters.risk && filters.risk !== 'all') {
      filtered = filtered.filter(contract => contract.risk === filters.risk);
    }

    return filtered;
  },

  // Get contract by ID
  async getContractById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const contract = mockContractDetails[id];
    if (!contract) {
      throw new Error('Contract not found');
    }

    return contract;
  },

  // Create new contract
  async createContract(contractData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newContract = {
      id: `c${Date.now()}`,
      ...contractData,
      status: 'Active',
      risk: 'Medium'
    };

    return newContract;
  },

  // Update contract
  async updateContract(id, updates) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const contract = mockContractDetails[id];
    if (!contract) {
      throw new Error('Contract not found');
    }

    return { ...contract, ...updates };
  },

  // Delete contract
  async deleteContract(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return { success: true, message: 'Contract deleted successfully' };
  },

  // Upload contract files
  async uploadFiles(files) {
    // Simulate file upload with progress
    const uploadPromises = files.map(async (file, index) => {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000 + (index * 500)));
      
      // Simulate occasional failures
      if (Math.random() < 0.1) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      return {
        id: `file_${Date.now()}_${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: `https://example.com/files/${file.name}`,
        uploadedAt: new Date().toISOString()
      };
    });

    return Promise.all(uploadPromises);
  },

  // Get contract analytics
  async getAnalytics() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      totalContracts: mockContracts.length,
      activeContracts: mockContracts.filter(c => c.status === 'Active').length,
      expiringSoon: mockContracts.filter(c => c.status === 'Renewal Due').length,
      riskDistribution: {
        high: mockContracts.filter(c => c.risk === 'High').length,
        medium: mockContracts.filter(c => c.risk === 'Medium').length,
        low: mockContracts.filter(c => c.risk === 'Low').length
      }
    };
  }
};