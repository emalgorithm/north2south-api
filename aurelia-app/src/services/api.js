import 'fetch'
import { HttpClient } from 'aurelia-fetch-client';

export class RestApi {

	static inject = [HttpClient]

	constructor(http) {
		this.http = http.configure(config => {
			config
				.withBaseUrl('/api/')
				.withDefaults({
					headers: {
						'Accept': 'application/json',
						'X-Requested-With': 'Fetch'
					}
				})
				.withInterceptor({
					request(request) {
						console.log(`Reuqesting ${request.method} ${request.url}`)
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
		return this.http.fetch('journeys/feed')
			.then(response => response.json())
	}

	getJourney(id) {
		return this.http.fetch(`journeys/${id}`)
			.then(response => response.json())
	}
}
