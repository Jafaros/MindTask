import { getContext, setContext } from 'svelte';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'mindtask_quotes';
const QUOTE_API_URL = 'https://api.realinspire.live/v1/';

/*const topics = [
	'success',
	'wisdom',
	'inspiration',
	'life',
	'motivation',
	'happiness',
	'philosophy',
	'courage'
];*/

export interface IQuote {
	id: string;
	text: string;
	author?: string;
}

class QuoteService {
	private quotes = $state<IQuote[]>([]);

	constructor() {
		this.LoadQuotesFromStorage();
	}

	public LoadQuotes = (quotes: IQuote[]): void => {
		this.quotes = quotes;
	};

	private LoadQuotesFromStorage = async (): Promise<void> => {
		const { value } = await Preferences.get({ key: STORAGE_KEY });

		if (value) {
			this.quotes = JSON.parse(value) as IQuote[];
		}
	};

	public async FetchRandomQuoteFromAPI(): Promise<IQuote | undefined> {
		const response = await fetch(`${QUOTE_API_URL}/quotes/random`, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json'
			}
		});

		const result = await response.json();

		if (response.ok) {
			const quote: IQuote = { text: result[0].content, author: result[0].author } as IQuote;
			return quote;
		}
	}

	private SaveQuotes = async (): Promise<void> => {
		await Preferences.set({
			key: STORAGE_KEY,
			value: JSON.stringify(this.quotes)
		});
	};

	public ToggleQuote = (quote: IQuote): void => {
		if (this.isSaved(quote)) this.RemoveQuote(quote.id);
		else this.AddQuote(quote);
	};

	public AddQuote = (quote: IQuote): void => {
		quote.id = crypto.randomUUID();
		this.quotes.push(quote);
		this.SaveQuotes();
	};

	public isSaved = (quote: IQuote): boolean => {
		const savedQuote = this.quotes.filter((q) => q.author === quote.author && q.text == quote.text);
		console.log(savedQuote);
		return savedQuote.length > 0 ? true : false;
	};

	public RemoveQuote = (quoteId: string): void => {
		this.quotes = this.quotes.filter((quote) => quote.id !== quoteId);
		this.SaveQuotes();
	};

	public ClearQuotes = (): void => {
		this.quotes = [];
	};

	public GetAllQuotes = $derived(() => {
		return this.quotes;
	});
}

const QUOTE_KEY = Symbol('QUOTE_KEY');

export function SetQuoteState() {
	return setContext(QUOTE_KEY, new QuoteService());
}

export function GetQuoteState() {
	return getContext<ReturnType<typeof SetQuoteState>>(QUOTE_KEY);
}
