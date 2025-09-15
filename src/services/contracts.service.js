// src/services/contracts.service.js

// Mock data for development
const mockContracts = [
  {
    id: "c1",
    name: "MSA 2025",
    parties: "Microsoft & ABC Corp",
    start: "2023-01-01",
    expiry: "2025-12-31",
    status: "Active",
    risk: "Medium",
    clauses: [
      { 
        title: "Termination", 
        summary: "90 days notice period required for contract termination.", 
        confidence: 0.82 
      },
      { 
        title: "Liability Cap", 
        summary: "Total liability limited to 12 months' fees.", 
        confidence: 0.87 
      },
      {
        title: "Data Protection",
        summary: "GDPR compliance required for all data processing.",
        confidence: 0.91
      }
    ],
    insights: [
      { 
        risk: "High", 
        message: "Liability cap excludes data breach costs, creating potential exposure." 
      },
      { 
        risk: "Medium", 
        message: "Contract auto-renews unless cancelled 60 days before expiry." 
      },
      {
        risk: "Low",
        message: "Standard termination clause with adequate notice period."
      }
    ],
    evidence: [
      { 
        source: "Section 12.2", 
        snippet: "Total liability shall be limited to the aggregate amount of fees paid in the twelve months preceding the claim.", 
        relevance: 0.91 
      },
      {
        source: "Section 8.1",
        snippet: "Either party may terminate this agreement with ninety (90) days written notice.",
        relevance: 0.88
      },
      {
        source: "Section 15.3",
        snippet: "This agreement shall automatically renew for successive one-year terms unless terminated.",
        relevance: 0.85
      }
    ]
  },
  {
    id: "c2",
    name: "Network Services Agreement",
    parties: "TelNet & ABC Corp",
    start: "2024-01-01",
    expiry: "2025-10-10",
    status: "Renewal Due",
    risk: "High",
    clauses: [
      { 
        title: "Service Level Agreement", 
        summary: "99.9% uptime guarantee with penalties for breaches.", 
        confidence: 0.94 
      },
      { 
        title: "Force Majeure", 
        summary: "Standard force majeure clause with pandemic provisions.", 
        confidence: 0.76 
      }
    ],
    insights: [
      { 
        risk: "High", 
        message: "No liability cap defined for service outages exceeding SLA." 
      },
      { 
        risk: "Medium", 
        message: "Force majeure clause may not cover all cyber security incidents." 
      }
    ],
    evidence: [
      { 
        source: "Section 4.1", 
        snippet: "Provider guarantees 99.9% network availability measured monthly.", 
        relevance: 0.93 
      },
      {
        source: "Section 11.2",
        snippet: "Force majeure events include acts of God, war, terrorism, and pandemic declarations.",
        relevance: 0.78
      }
    ]
  },
  {
    id: "c3",
    name: "Software License Agreement",
    parties: "TechSoft Inc & ABC Corp",
    start: "2024-06-01",
    expiry: "2026-05-31",
    status: "Active",
    risk: "Low",
    clauses: [
      { 
        title: "License Grant", 
        summary: "Non-exclusive license for internal business use only.", 
        confidence: 0.89 
      },
      { 
        title: "Support & Maintenance", 
        summary: "24/7 support included with annual maintenance fee.", 
        confidence: 0.92 
      }
    ],
    insights: [
      { 
        risk: "Low", 
        message: "Standard software license terms with reasonable restrictions." 
      },
      { 
        risk: "Medium", 
        message: "Support response times not clearly defined for critical issues." 
      }
    ],
    evidence: [
      { 
        source: "Section 2.1", 
        snippet: "Licensor grants to Licensee a non-exclusive, non-transferable license to use the Software.", 
        relevance: 0.90 
      }
    ]
  },
  {
    id: "c4",
    name: "Consulting Services Contract",
    parties: "Expert Consultants & ABC Corp",
    start: "2024-03-15",
    expiry: "2024-12-15",
    status: "Active",
    risk: "Medium",
    clauses: [
      { 
        title: "Scope of Work", 
        summary: "IT infrastructure assessment and optimization recommendations.", 
        confidence: 0.85 
      },
      { 
        title: "Payment Terms", 
        summary: "Monthly invoicing with 30-day payment terms.", 
        confidence: 0.91 
      }
    ],
    insights: [
      { 
        risk: "Medium", 
        message: "Scope creep potential due to loosely defined deliverables." 
      },
      { 
        risk: "Low", 
        message: "Standard payment terms with reasonable timeframes." 
      }
    ],
    evidence: [
      { 
        source: "Exhibit A", 
        snippet: "Consultant shall provide strategic recommendations for IT infrastructure optimization.", 
        relevance: 0.86 
      }
    ]
  },
  {
    id: "c5",
    name: "Cloud Storage Agreement",
    parties: "CloudStore Pro & ABC Corp",
    start: "2023-09-01",
    expiry: "2024-08-31",
    status: "Expired",
    risk: "High",
    clauses: [
      { 
        title: "Data Security", 
        summary: "End-to-end encryption with customer-managed keys.", 
        confidence: 0.88 
      },
      { 
        title: "Data Retention", 
        summary: "90-day retention after account termination.", 
        confidence: 0.83 
      }
    ],
    insights: [
      { 
        risk: "High", 
        message: "Contract has expired - immediate renewal required to maintain service." 
      },
      { 
        risk: "Medium", 
        message: "Short data retention period may cause data loss if not renewed promptly." 
      }
    ],
    evidence: [
      { 
        source: "Section 7.3", 
        snippet: "All data will be permanently deleted 90 days after account termination.", 
        relevance: 0.95 
      }
    ]
  }
];

class ContractsService {
  constructor() {
    this.contracts = mockContracts;
    this.baseDelay = 500; // Simulate network delay
  }

  // Simulate API delay
  async delay(ms = this.baseDelay) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all contracts with optional filtering
  async getContracts(filters = {}) {
    await this.delay();

    try {
      let filteredContracts = [...this.contracts];

      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredContracts = filteredContracts.filter(contract =>
          contract.name.toLowerCase().includes(searchTerm) ||
          contract.parties.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.status && filters.status !== 'all') {
        filteredContracts = filteredContracts.filter(contract => 
          contract.status === filters.status
        );
      }

      if (filters.risk && filters.risk !== 'all') {
        filteredContracts = filteredContracts.filter(contract => 
          contract.risk === filters.risk
        );
      }

      // Sort by name by default
      filteredContracts.sort((a, b) => a.name.localeCompare(b.name));

      return filteredContracts;
    } catch (error) {
      throw new Error('Failed to fetch contracts: ' + error.message);
    }
  }

  // Get contract by ID
  async getContractById(id) {
    await this.delay();

    try {
      const contract = this.contracts.find(c => c.id === id);
      if (!contract) {
        throw new Error(`Contract with ID ${id} not found`);
      }
      return contract;
    } catch (error) {
      throw new Error('Failed to fetch contract details: ' + error.message);
    }
  }

  // Create new contract
  async createContract(contractData) {
    await this.delay(1000);

    try {
      const newContract = {
        id: `c${this.contracts.length + 1}`,
        ...contractData,
        clauses: contractData.clauses || [],
        insights: contractData.insights || [],
        evidence: contractData.evidence || []
      };

      this.contracts.push(newContract);
      return newContract;
    } catch (error) {
      throw new Error('Failed to create contract: ' + error.message);
    }
  }

  // Update existing contract
  async updateContract(id, updates) {
    await this.delay(800);

    try {
      const index = this.contracts.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error(`Contract with ID ${id} not found`);
      }

      this.contracts[index] = { ...this.contracts[index], ...updates };
      return this.contracts[index];
    } catch (error) {
      throw new Error('Failed to update contract: ' + error.message);
    }
  }

  // Delete contract
  async deleteContract(id) {
    await this.delay(600);

    try {
      const index = this.contracts.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error(`Contract with ID ${id} not found`);
      }

      const deletedContract = this.contracts.splice(index, 1)[0];
      return deletedContract;
    } catch (error) {
      throw new Error('Failed to delete contract: ' + error.message);
    }
  }

  // Upload files (mock implementation)
  async uploadFiles(files) {
    await this.delay(2000);

    try {
      // Simulate file processing
      const results = files.map((file, index) => ({
        id: `upload_${Date.now()}_${index}`,
        filename: file.name,
        size: file.size,
        type: file.type,
        status: Math.random() > 0.1 ? 'success' : 'error',
        message: Math.random() > 0.1 ? 'Upload successful' : 'Upload failed'
      }));

      return results;
    } catch (error) {
      throw new Error('Failed to upload files: ' + error.message);
    }
  }

  // Get contract statistics
  async getContractStats() {
    await this.delay(300);

    try {
      const contracts = await this.getContracts();
      
      return {
        total: contracts.length,
        active: contracts.filter(c => c.status === 'Active').length,
        expired: contracts.filter(c => c.status === 'Expired').length,
        renewalDue: contracts.filter(c => c.status === 'Renewal Due').length,
        highRisk: contracts.filter(c => c.risk === 'High').length,
        mediumRisk: contracts.filter(c => c.risk === 'Medium').length,
        lowRisk: contracts.filter(c => c.risk === 'Low').length
      };
    } catch (error) {
      throw new Error('Failed to fetch contract statistics: ' + error.message);
    }
  }

  // Search contracts
  async searchContracts(query) {
    await this.delay(400);

    try {
      if (!query || query.trim() === '') {
        return [];
      }

      const searchTerm = query.toLowerCase().trim();
      const results = this.contracts.filter(contract =>
        contract.name.toLowerCase().includes(searchTerm) ||
        contract.parties.toLowerCase().includes(searchTerm) ||
        contract.status.toLowerCase().includes(searchTerm) ||
        contract.risk.toLowerCase().includes(searchTerm)
      );

      return results;
    } catch (error) {
      throw new Error('Failed to search contracts: ' + error.message);
    }
  }
}

// Export singleton instance
export const contractsService = new ContractsService();