import axiosRateLimit from "axios-rate-limit";
import axios, {AxiosRequestConfig, AxiosInstance} from "axios";
import qs from 'qs';

interface RateLimitedAxiosInstance extends AxiosInstance {
}

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

/**
 * Ebay ratelimits to 5000 calls per day per default
 */
const RATELIMIT = (5000 / day) * second; // req/sec

const AxiosInstance = axios.create();

const req: RateLimitedAxiosInstance = axiosRateLimit(AxiosInstance, {
    maxRequests: Math.floor(RATELIMIT * minute),
    perMilliseconds: 5000
});

export class LimitedAxiosRequest {
    get<T = any, R = any>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return req.get(url, config).then(({data}) => data);
    }

    post<T = any, R = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>  {
        return req.post(url, data, config).then(({data}) => data);
    }

    postForm<T = any, R = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>  {
        return req.post(url, qs.stringify(data), config).then(({data}) => data);
    }
}

const instance = new LimitedAxiosRequest();
export default instance;