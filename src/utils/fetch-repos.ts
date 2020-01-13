import axios from 'axios';
import { Repo } from '../types';
const CancelToken = axios.CancelToken;

type CacheResult = {
  query: string, page: number, result: any
}

export const CANCELLED_EVENT_CODE = 'CANCELLED';
const CACHE_LIMIT = 5;

export default function createFetchRepos() {
  let cancelPrevious: any;
  const cachedResults: CacheResult[] = [];

  return async function (query: string, page: number): Promise<{ data: { items: Repo[] } } | any> {
    if (typeof cancelPrevious === 'function') {
      cancelPrevious();
    }

    const cachedResult = cachedResults.find((cached) => cached.page === page && cached.query === query);

    if (cachedResult) { return cachedResult.result }

    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=${query}+in:name&sort=stars&page=${page}`,
        {
          cancelToken: new CancelToken((cancel) => {
            cancelPrevious = () => {
              cancel();
              cancelPrevious = null;
            };
          })
      });

      cachedResults.push({ query, page, result: response });

      if (cachedResults.length > CACHE_LIMIT) {
        cachedResults.shift();
      }

      return response;
    } catch (thrownError) {
      if (axios.isCancel(thrownError)) {
        return CANCELLED_EVENT_CODE;
      }
      throw thrownError;
    }
  }
}
