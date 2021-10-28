import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {

  constructor() {
  }

  getWeather(url: string, options: AxiosRequestConfig): Promise<AxiosResponse<any, any>> {
    return axios.get(url, options);
  }

}
