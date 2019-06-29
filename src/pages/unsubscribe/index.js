import React, { Component } from 'react';
import { Mutation } from "react-apollo";

import { UNSUBSCRIBE_USER_MUTATION } from '../../operations/mutations';
import './index.css';

class Unsubscribe extends Component {
	componentDidMount() {
		const { mutation, email, type } = this.props;
		mutation({ variables: { email, type, subscribe: false } });	
	}

	render() {
		const { mutation, email, type } = this.props;
		
		let formattedType;
		switch (type) {
			case "subscribePromo":
				formattedType = "promotional"
				break;
			case "subscribeEarlyAccess":
				formattedType = "early access"
				break;
			case "subscribeNews":
				formattedType = "news"
				break;
		}		

		return (
			<div className="unsubscribe">
				<h2>YOU WILL BE MISSED</h2>
				<p>You have been unsubscribed from our {formattedType} emails</p>
				<p 
					className="link" 
					onClick={async () => { 
						await mutation({ variables: { email, type, subscribe: true } });
						window.location.assign("/");
					}}
				>Was that a mistake?</p>
			</div>
		);
	}
}

export default ({ email, type }) => (
	<Mutation mutation={UNSUBSCRIBE_USER_MUTATION}>
		{subscribeUpdate => {
			return (
				<Unsubscribe mutation={subscribeUpdate} email={email} type={type} />
			)
		}}
	</Mutation>
)
