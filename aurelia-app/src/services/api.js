import 'fetch'
import { HttpClient } from 'aurelia-fetch-client';

export class RestApi {

	static inject = [HttpClient]

	constructor(http) {
		this.isRequesting = false
		this.http = http.configure(config => {
			config
				.withBaseUrl('/')
				.withDefaults({
					headers: {
						'Accept': 'application/json',
						'X-Requested-With': 'Fetch'
					}
				})
				.withInterceptor({
					request(request) {
						console.log('Reuqesting ${request.method} ${request.url}')
						return request
					},

					response(response) {
						console.log(`Received ${response.status} ${response.url}`);
						return response;
					}

				})
		})
	}

	getJourneyList() {
		this.isRequesting = true
		return this.http.fetch('journeys')
			.then(response => response.json())
			.then(journeys => {
				console.log(journeys)
				return journeys
			})
	}
}