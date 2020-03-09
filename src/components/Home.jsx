import React, { Component } from 'react';

class Home extends Component {
	render() {
		return(
			<div className="home-wrapper">
				<h2>Welcome to the Hydro Events Marketplace.</h2>
				<hr />
				<p>The Hydro Events Marketplace dApp is a service that provides ability to create events and sell tickets for them, with options to make a paid or free event.</p>
				<p>Tickets created on this service are ERC721 tokens, that means that users are free to move, gift or sell those tickets to other users.</p>
				<p>Hydro Events Marketplace is dApp running on the Ethereum blockchain. In order to Create events or Purchase tickets, you should have an Ethereum wallet.</p>
			</div>
		);
	}
}

export default Home;
