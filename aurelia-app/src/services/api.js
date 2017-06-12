import 'fetch'
import { HttpClient } from 'aurelia-fetch-client';

export class RestApi {
	isRequesting = false
	client = new HttpClient().configure(c => {
        c.withBaseUrl('/')
      })

	getJourneyList() {
		this.isRequesting = true
		return 
	}
}