#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
const server = new McpServer({
    name: "Sensor Tower Advanced MCP Server",
    version: "0.1.0"
});
const SENSOR_TOWER_BASE_URL = process.env.SENSOR_TOWER_BASE_URL || 'https://api.sensortower.com';
const AUTH_TOKEN = process.env.SENSOR_TOWER_API_TOKEN || process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) {
    console.warn("Warning: SENSOR_TOWER_API_TOKEN environment variable is not set.");
}
/**
 * Custom error class for Sensor Tower API errors
 */
class SensorTowerApiError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SensorTowerApiError';
    }
}
/**
 * Service class for interacting with Sensor Tower API
 */
class SensorTowerAdvancedApiService {
    /**
     * Helper function to handle API requests
     */
    async request(url, errorMessage) {
        if (!AUTH_TOKEN) {
            throw new SensorTowerApiError('Authentication token is missing. Please set SENSOR_TOWER_API_TOKEN.');
        }
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                const errorBody = await response.text();
                // Check for specific error codes
                if (response.status === 401 || response.status === 403) {
                    throw new SensorTowerApiError(`Authentication failed (HTTP ${response.status}): ${errorBody}`);
                }
                if (response.status === 429) {
                    throw new SensorTowerApiError(`Rate limit exceeded (HTTP 429): ${errorBody}`);
                }
                throw new Error(`HTTP ${response.status}: ${errorBody}`);
            }
            return await response.json();
        }
        catch (error) {
            if (error instanceof SensorTowerApiError) {
                throw error;
            }
            console.error(`Error in ${errorMessage}:`, error);
            throw new SensorTowerApiError(`Failed to ${errorMessage}: ${error.message}`);
        }
    }
    /**
     * Fetch user demographics for apps
     *
     * @param os Operating system (ios or android)
     * @param appIds Array of app IDs
     * @param startDate Start date (YYYY-MM-DD)
     * @param endDate End date (YYYY-MM-DD)
     * @param options Optional parameters (countries, date_granularity)
     */
    async fetchDemographics(os, appIds, startDate, endDate, options) {
        const validOs = ['ios', 'android'];
        if (!validOs.includes(os.toLowerCase())) {
            throw new SensorTowerApiError(`Invalid OS: ${os}. Must be one of: ${validOs.join(', ')}`);
        }
        if (!appIds || appIds.length === 0) {
            throw new SensorTowerApiError('At least one app ID is required.');
        }
        // Validate dates
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            throw new SensorTowerApiError('Dates must be in YYYY-MM-DD format.');
        }
        const queryParams = new URLSearchParams();
        queryParams.append('app_ids', appIds.join(','));
        queryParams.append('start_date', startDate);
        queryParams.append('end_date', endDate);
        queryParams.append('auth_token', AUTH_TOKEN);
        if (options?.countries && options.countries.length > 0) {
            queryParams.append('countries', options.countries.join(','));
        }
        if (options?.date_granularity) {
            queryParams.append('date_granularity', options.date_granularity);
        }
        const url = `${SENSOR_TOWER_BASE_URL}/v1/${os.toLowerCase()}/usage/demographics?${queryParams.toString()}`;
        return this.request(url, 'fetch demographics');
    }
}
const apiService = new SensorTowerAdvancedApiService();
/**
 * Tool: get_demographics
 * Fetches user demographics including age and gender distribution
 */
server.tool("get_demographics", "Fetches user demographics (age, gender) for specific apps over a time range. Useful for user persona analysis and marketing targeting.", {
    os: z.enum(["ios", "android"]).describe("Operating system of the apps"),
    app_ids: z.string().describe("Comma-separated list of App IDs (e.g., '284882215,389801252')"),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").describe("Start date for the analysis range"),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").describe("End date for the analysis range"),
    countries: z.string().optional().describe("Comma-separated list of Country Codes (e.g., 'US,CN'). Defaults to worldwide if omitted."),
    date_granularity: z.enum(["daily", "weekly", "monthly", "quarterly"]).optional().describe("Granularity of the data (default: daily)")
}, async ({ os, app_ids, start_date, end_date, countries, date_granularity }) => {
    try {
        const appIdArray = app_ids.split(',').map(id => id.trim()).filter(id => id.length > 0);
        const countryArray = countries ? countries.split(',').map(c => c.trim()).filter(c => c.length > 0) : undefined;
        const data = await apiService.fetchDemographics(os, appIdArray, start_date, end_date, {
            countries: countryArray,
            date_granularity
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2)
                }
            ]
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching demographics: ${error.message}`
                }
            ],
            isError: true
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Sensor Tower Advanced MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
