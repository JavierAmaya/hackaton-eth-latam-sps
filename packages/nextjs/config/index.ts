const availableNetworks = ["scrollMainnet", "scrollSepolia"] as const;
type AvailableNetworks = (typeof availableNetworks)[number];

// RPC
type RPCs = Record<
  AvailableNetworks,
  {
    http: string;
  }
>;
const rpcs: RPCs = {
  scrollMainnet: {
    http: "https://sepolia-rpc.scroll.io",
  },
  scrollSepolia: {
    http: "https://sepolia-rpc.scroll.io",
  },
};

// Addresses
type Addresses = Record<
  AvailableNetworks,
  {
    easContract: `0x${string}`;
    schemaRegistryContract: `0x${string}`;
  }
>;
const addresses: Addresses = {
  scrollMainnet: {
    easContract: "0xC47300428b6AD2c7D03BB76D05A176058b47E6B0",
    schemaRegistryContract: "0xD2CDF46556543316e7D34e8eDc4624e2bB95e3B6",
  },
  scrollSepolia: {
    easContract: "0xaEF4103A04090071165F78D45D83A0C0782c2B2a",
    schemaRegistryContract: "0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797",
  },
};

// Block explorers
type Explorers = Record<
  AvailableNetworks,
  {
    blockchain: string;
    attestation: string;
  }
>;
const explorers: Explorers = {
  scrollMainnet: {
    blockchain: "https://scrollscan.com/",
    attestation: "https://scroll.easscan.org/attestation/view",
  },
  scrollSepolia: {
    blockchain: "https://sepolia.scrollscan.com",
    attestation: "https://scroll-sepolia.easscan.org/attestation/view",
  },
};

type Attestation = {
  id: string;
  name: string;
  schema: string;
};

type Attestations = Record<
  AvailableNetworks,
  {
    gradesReport: Attestation;
    assistanceReport: Attestation;
  }
>;

const attestations: Attestations = {
  scrollMainnet: {
    gradesReport: {
      id: "0x0000000000000000000000000000000000000000000000000000000000000000",
      name: "Boleta de Calificaciones",
      schema:
        "string studentId, string studentAlias, uint16 year, string period, string subjectName1, string subjectScore1, string subjectName2, string subjectScore2, string subjectName3, string subjectScore3, string subjectName4, string subjectScore4, string subjectName5, string subjectScore5, string subjectName6, string subjectScore6",
    },
    assistanceReport: {
      id: "0x77d7c27963d7285d3a7c63c6227f52f54634c0e7dd96bf89ce99e1bd00d4bbff",
      name: "Reporte de Asistencia",
      schema: "string teacherId, string teacherAlias, addresses[] students",
    },
  },
  scrollSepolia: {
    gradesReport: {
      id: "0x1564fec3ee6b0bdec2ea10f96041613724baeccee413712e8e37679e69f1f131",
      name: "Boleta de Calificaciones",
      schema:
        "string studentId,string studentAlias,uint16 year,string period,string subjectName1,string subjectScore1,string subjectName2,string subjectScore2,string subjectName3,string subjectScore3,string subjectName4,string subjectScore4,string subjectName5,string subjectScore5,string subjectName6,string subjectScore6",
    },
    assistanceReport: {
      id: "0x77d7c27963d7285d3a7c63c6227f52f54634c0e7dd96bf89ce99e1bd00d4bbff",
      name: "Reporte de Asistencia",
      schema: "string teacherId, string teacherAlias, addresses[] students",
    },
  },
};

const appConfig = {
  rpcs,
  addresses,
  attestations,
  explorers,
} as const;

export default appConfig;
