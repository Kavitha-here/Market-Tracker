import { GoogleGenAI, Type } from "@google/genai";
import { Stock, HistoricalDataPoint, NewsArticle } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const stockDataSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The full name of the company or financial instrument." },
    ticker: { type: Type.STRING, description: "The official stock ticker symbol." },
    currentValue: { type: Type.NUMBER, description: "The current market price of the stock." },
    ytdReturn: { type: Type.NUMBER, description: "The year-to-date return as a percentage." },
    dailyChange: { type: Type.NUMBER, description: "The percentage change in price for the current day." },
    marketCap: { type: Type.NUMBER, description: "The total market capitalization in USD." },
    fiftyTwoWeekHigh: { type: Type.NUMBER, description: "The highest price in the last 52 weeks." },
    fiftyTwoWeekLow: { type: Type.NUMBER, description: "The lowest price in the last 52 weeks." },
  },
  required: ['name', 'ticker', 'currentValue', 'ytdReturn', 'dailyChange', 'marketCap', 'fiftyTwoWeekHigh', 'fiftyTwoWeekLow'],
};

export const fetchStockData = async (query: string): Promise<Stock> => {
  try {
    const prompt = `Provide the current stock data for ${query}, which could be a ticker symbol or a company name. Include its full name, ticker symbol, current price, YTD return as a percentage, daily percentage change, market capitalization in USD, 52-week high, and 52-week low. If the ticker is not real, provide fictional but realistic data. The response must be in JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: stockDataSchema,
      },
    });

    const text = response.text.trim();
    if (!text) {
        throw new Error("Received empty response from Gemini API.");
    }

    const parsedData = JSON.parse(text);
    parsedData.ticker = parsedData.ticker.toUpperCase();
    return parsedData as Stock;

  } catch (error) {
    console.error("Error fetching stock data from Gemini:", error);
    throw new Error(`Failed to process data for query ${query}.`);
  }
};

const historicalDataSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            date: { type: Type.STRING, description: "The date of the price point in YYYY-MM-DD format." },
            price: { type: Type.NUMBER, description: "The closing price for that date." }
        },
        required: ['date', 'price'],
    }
};

export const fetchHistoricalData = async (ticker: string, range: '1m' | '6m' | '1y' | '5y'): Promise<HistoricalDataPoint[]> => {
    try {
        const prompt = `Provide historical daily closing prices for the ticker ${ticker} for the last ${range}. Return about 30-60 data points, evenly spaced over the period. The response must be a JSON array of objects, where each object has a 'date' (YYYY-MM-DD) and a 'price'.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: historicalDataSchema,
            },
        });

        const text = response.text.trim();
        if(!text) {
            throw new Error("Received empty historical data from Gemini API.");
        }
        const parsedData = JSON.parse(text);
        // Sort data just in case API returns it unordered
        return parsedData.sort((a: HistoricalDataPoint, b: HistoricalDataPoint) => new Date(a.date).getTime() - new Date(b.date).getTime());

    } catch (error) {
        console.error(`Error fetching historical data for ${ticker}:`, error);
        throw new Error(`Failed to fetch historical data for ${ticker}.`);
    }
};

const newsArticleSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The headline of the news article." },
        source: { type: Type.STRING, description: "The name of the news publication or source (e.g., Reuters, Bloomberg)." },
        url: { type: Type.STRING, description: "The direct URL to the full article." },
        publishedAt: { type: Type.STRING, description: "The publication date in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)." },
        summary: { type: Type.STRING, description: "A brief one or two-sentence summary of the article." },
    },
    required: ['title', 'source', 'url', 'publishedAt', 'summary'],
};

const newsFeedSchema = {
    type: Type.ARRAY,
    items: newsArticleSchema,
};

export const fetchFinancialNews = async (): Promise<NewsArticle[]> => {
    try {
        const prompt = "Provide the top 5 most recent and important global financial news articles. Focus on market-moving news. For each article, include the title, source, a direct URL, the publication date in ISO 8601 format, and a brief summary.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: newsFeedSchema,
            },
        });

        const text = response.text.trim();
        if (!text) {
            throw new Error("Received empty news data from Gemini API.");
        }
        return JSON.parse(text) as NewsArticle[];
    } catch (error) {
        console.error("Error fetching financial news from Gemini:", error);
        throw new Error("Failed to fetch financial news.");
    }
};