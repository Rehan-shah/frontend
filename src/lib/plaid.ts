import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid';

// Get environment variables
const PLAID_ENV = (process.env.PLAID_ENV || 'sandbox').toLowerCase();
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;

// Validate environment
if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  console.warn('⚠️  Plaid credentials not found. Please set PLAID_CLIENT_ID and PLAID_SECRET in your .env.local file');
}

// Map environment string to Plaid environment
const getPlaidEnvironment = (env: string) => {
  switch (env) {
    case 'production':
      return PlaidEnvironments.production;
    case 'development':
      return PlaidEnvironments.development;
    case 'sandbox':
    default:
      return PlaidEnvironments.sandbox;
  }
};

const configuration = new Configuration({
  basePath: getPlaidEnvironment(PLAID_ENV),
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID || '',
      'PLAID-SECRET': PLAID_SECRET || '',
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
