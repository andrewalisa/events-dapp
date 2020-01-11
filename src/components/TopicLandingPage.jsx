import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Loading from './Loading';
import Event from './Event';

import topicsJson from '../config/topics.json';


class TopicLandingPage extends Component
{
  constructor(props, context)
  {
      super(props);
	    this.contracts = context.drizzle.contracts;
	    this.eventCount = this.contracts['OpenEvents'].methods.getEventsCount.cacheCall();
	    this.perPage = 6;
      this.topicClick = this.topicClick.bind(this);
      this.theTopic = this.getTopicData();
      this.topicBackground = this.theTopic['image'];
	}

  componentDidUpdate()
  {
    //this.theTopic = this.getTopicData();
	}

	componentDidMount()
  {
    //this.theTopic = this.getTopicData();
	}

	componentWillUnmount()
  {

	}

  topicClick(slug)
  {
    this.props.history.push("/topic/"+slug);
    this.theTopic = this.getTopicData();

    window.scrollTo(0, 0);
  }

  getLastURLSegment()
  {
    console.log(this.props.history.location.pathname);
    let currentRoute = this.props.history.location.pathname;
    let lastSegment = currentRoute.substr(currentRoute.lastIndexOf('/') + 1);

    return lastSegment;
  }

  getTopicData() {
    let topicSlug = this.getLastURLSegment();

    let theTopic = topicsJson.filter(function (topic) {
      return topic.slug == topicSlug;
    });

    return theTopic[0];
  }

	render()
  {
		let body = <Loading />;
    const topic = this.theTopic;

		if (typeof this.props.contracts['OpenEvents'].getEventsCount[this.eventCount] !== 'undefined') {
			let count = Number(this.props.contracts['OpenEvents'].getEventsCount[this.eventCount].value);
			if (count === 0) {
				body = <p className="text-center not-found"><span role="img" aria-label="thinking">🤔</span>&nbsp;No events found. <a href="/createevent">Try creating one.</a></p>;
			} else {
				let currentPage = Number(this.props.match.params.page);
				if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

				let end = currentPage * this.perPage;
				let start = end - this.perPage;
				if (end > count) end = count;
				let pages = Math.ceil(count / this.perPage);

				let events_list = [];

				for (let i = start; i < end; i++) {
					events_list.push(<Event key={i} id={i} />);
				}

				let pagination = '';
				if (pages > 1) {
					let links = [];

					for (let i = 1; i <= pages; i++) {
						let active = i === currentPage ? 'active' : '';
						links.push(
							<li className={"page-item " + active} key={i}>
								<Link to={"/findevents/" + i} className="page-link">{i}</Link>
							</li>
						);
					}

					pagination =
						<nav>
							<ul className="pagination justify-content-center">
								{links}
							</ul>
						</nav>
					;
				}

				body =
					<div >
						<div className="row user-list mt-4">
							{events_list}
						</div>
						{pagination}
					</div>
				;
			}
		}

		return(
      <React.Fragment>
      <div className="retract-page-inner-wrapper">
        <div className="topic-hero-wrapper">
          <img src={'/images/topics/'+this.theTopic['image']} alt={topic.name} />
        </div>
      </div>

			<div className="retract-page-inner-wrapper-alternative">

      <br /><br />

      <div>
          <h2><i className="fa fa-calendar-alt"></i> Events In The <strong>{topic.name}</strong> Topic</h2>
          <hr />
          {body}
      </div>

      <br /><br />

      
      <h2><i className="fa fa-calendar-alt"></i> More Topics</h2>
      <hr />
        <div className="row user-list mt-4">
          {topicsJson.map(topic => (
            <div className="col-lg-4 pb-4 d-flex align-items-stretch" key={topic.slug}>
              <div className="topic" style={{ backgroundImage: "url(/images/topics/" + topic.image +")"}} onClick={() => {this.topicClick(topic.slug)}}>
              <div className="topic-caption"><h3>{topic.name}</h3><button className="btn sort_button col-md-2">View Topic</button></div>
              </div>
            </div>
            ))}
        </div>
      


    </div>

    </React.Fragment>
		);
	}
}

TopicLandingPage.contextTypes =
{
    drizzle: PropTypes.object
}

const mapStateToProps = state =>
{
    return {
		contracts: state.contracts,
		accounts: state.accounts
    };
};

const AppContainer = drizzleConnect(TopicLandingPage, mapStateToProps);
export default AppContainer;
