import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { SearchView, SearchField } from '../Utilities/Utilities.jsx';
import { toggleModal } from '../Utilities/Modal/Modal.jsx';
import { _Bookmark } from '../../../api/bookmarks/bookmarks';
import { _Notifications } from '../../../api/notifications/notifications';
import { Institution } from '../../../api/settings/institution';
import { _ExternalLink } from '../../../api/externallink/externallink';
import Notifications from '../Notifications/Notifications.jsx';
import Bookmark from '../Bookmark/Bookmark.jsx';
import { Roles } from 'meteor/alanning:roles';
import MainModal from '../../modals/MainModal';

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modalIdentifier: '',
      modalType: '',
      title: '',
      confirm: '',
      reject: '',
      value: '',
    };
  }

  openSettings = () => {
    // event.preventDefault();

    Meteor.logout(error => {
      if (!error) {
        FlowRouter.go('/login');
      } else {
        // You can also verbose the logout error to the user
        return null;
      }
    });
  };

  getUserName() {
    const user = Meteor.user();
    if (user) {
      return `${user.profile.name} `;
    }
    return '';
  }

  getEmail() {
    const email = Meteor.user();
    if (email) {
      return email.emails[0].address;
    }
    return '';
  }

  takeToDashboard = () => {
    FlowRouter.go('/dashboard/accounts');
  };

  // show dashboard link only when the user has an admin role
  dashBoard() {
    if (Roles.userIsInRole(Meteor.userId(), ['admin', 'content-manager'])) {
      return (
        <div className="valign center-align" id="dashStylesDrop">
          <span
            className="dashLink link waves-effect waves-teal btn-flat"
            onClick={this.takeToDashboard}
          >
            dashboard
          </span>
        </div>
      );
    }
    return <div />;
  }

  handleSubmit = event => {
    event.preventDefault();
    const { modalType, value } = this.state;

    switch (modalType) {
      case 'note':
        FlowRouter.go('/notifications');

        break;
      case 'bookmarks':
        break;
      case 'link':
          break;
      case 'search':
        FlowRouter.go(`/results?q=${value}`);
        break;
      default:
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));

    // Add notifications for Admin
  };

  // Notifications Number
  countNotifications() {
    const count = this.props.notificationsCount;
    if (count === undefined) {
      return null;
    } else if (count < 1) {
      return (
        <a
          href="#"
          className="fa fa-bell fa-2x inst-link"
          onClick={e => this.toggleEditModal(e, 'note')}
        />
      );
    }
    return (
      <a href="#" onClick={e => this.toggleEditModal(e, 'note')} className="inst-link">
        <div id="notificationBellContainer">
          <i className="fa fa-bell fa-2x block" id="usrIcon" />
          <span className="danger-bg">{count}</span>
        </div>
      </a>
    );
  }

  handleUrl = (event, unitId, id, cat, topicId, fileId) => {
    // event.preventDefault();
    const read = true;
    Meteor.call('markRead', id, read);
    switch (cat) {
      case 'resource':
        FlowRouter.go(`/view_resource/${topicId}?rs=${fileId}&scid=${unitId}`);
        break;
      case 'unit':
        FlowRouter.go(`/contents/${unitId}?ref=home`);
        break;
      case 'reference':
        FlowRouter.go(`/extra/view_resource/extra?rs=${fileId}`);
        break;
      default:
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

handleExternalLinkUrl = (event, url) => {
  window.open(
    url,
    '_blank'
  );
}
  renderNotifications(nameClass) {
    const { notifications } = this.props;
    if (notifications === undefined || notifications.length === 0) {
      return <li className={`collection-item ${nameClass}`}> No new notifications!</li>;
    }
    notifications.length = 5;
    return notifications.map(notification => (
      <li key={notification._id}>
        {notification.read === true ? (
          <ul>
            <li
              style={{ backgroundColor: 'white', padding: '1px 10px 5px', cursor: 'pointer' }}
              onClick={e =>
                this.handleUrl(
                  this,
                  notification.unitId,
                  notification._id,
                  notification.category,
                  notification.topicId,
                  notification.fileId,
                )
              }
            >
              <span>
                {notification.title} <br />
                <span
                  className="fa fa-clock-o fa-2x"
                  style={{ fontSize: '12px', color: '#90949c' }}
                >
                  {' '}
                  <b> {moment(note.createdAt).fromNow()}</b>
                </span>
              </span>
            </li>
          </ul>
        ) : (
          <ul>
            <li
              style={{ backgroundColor: '#edf2fa', padding: '1px 10px 5px', cursor: 'pointer' }}
              onClick={e =>
                this.handleUrl(
                  this,
                  notification.unitId,
                  notification._id,
                  notification.category,
                  notification.topicId,
                  notification.fileId,
                )
              }
            >
              <span>
                {notification.title} <br />
                <span
                  className="fa fa-clock-o fa-2x"
                  style={{ fontSize: '12px', color: '#90949c' }}
                >
                  {' '}
                  <b> {moment(notification.createdAt).fromNow()}</b>
                </span>
              </span>
            </li>
          </ul>
        )}

        <hr />
      </li>
    ));
  }

  // update the notification collection on the click
  readAll = event => {
    event.preventDefault();
    FlowRouter.go('/notifications');
  };


    renderExternalLinks(nameClass) {
      const { externallinks } = this.props;
      if (externallinks === undefined || externallinks.length === 0) {

        return <li className={`collection-item ${nameClass}`}> No External links!
        </li>;
      }
      return externallinks.map(externallink => (
        <span key={externallink._id}>
              <a
                style={{ padding: '1px 10px 5px', cursor: 'pointer' }}
                onClick={e =>
                  this.handleExternalLinkUrl(
                    this,
                    externallink.url
                  )
                }
              >
                <span>
                <b>  {externallink.name}</b> <br />
                  <span
                    className="fa fa-link fa-2x"
                    style={{ fontSize: '10px', color: 'blue' }}
                  >
                    {' '}
                    <b> {externallink.url}</b>
                  </span>
                </span>
              </a>
            </span>
      ));
    }

  componentDidMount() {
    $('.button-collapse').sideNav({
      menuWidth: 300, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true, // Choose whether you can drag to open on touch screens
    });
    $('.collapsible').collapsible();

    $('.dropdown-button').dropdown({
      inDuration: 0,
      outDuration: 0,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false, // Stops event propagation
    });
  }

  markAllAsVisited(bool) {
    var allNotifications = this.props.notifications;

    return allNotifications.map(function(notifications) {
      id = notifications._id;
      Meteor.call('markRead', id, bool);
    });
  }

  renderInstitution() {
    // Render the name of the institution
    const { institution } = this.props;
    if (institution === undefined) {
      return null;
    } else if (institution.length === 0) {
      return (
        <div className="logo-container">
          <a href="/" className="inst-link">
            <img
              style={{ float: 'left' }}
              src={`/uploads/sparked.png`}
              alt="logo"
              width="80px"
              height="80px"
            />
            <h5>{'SparkEd'}</h5>
            <h6>{'Delivering Education Contents'}</h6>
          </a>
        </div>
      );
    } else {
      const {
        meta: { name, tagline },
      } = institution;
      return (
        <div className="logo-container">
          <a href="/" className="inst-link">
            <img
              style={{ float: 'left' }}
              src={`/uploads/logos/${institution._id}.${institution.ext}`}
              alt="logo"
              width="80px"
              height="80px"
            />
            <h5>{name}</h5>
            <h6>{tagline}</h6>
          </a>
        </div>
      );
    }
  }

  // close the modal, close the modal, and clear the states;
  close = () => this.setState(prevState => ({ isOpen: !prevState.isOpen }));

  toggleEditModal = (e, type) => {
    switch (type) {
      case 'note':
        this.setState({
          modalType: type,
          title: 'Notifications',
          confirm: 'More',
          reject: 'Close',
        });
        break;
      case 'bookmark':
        this.setState({
          modalType: type,
          title: 'Bookmarks',
          confirm: 'See',
          reject: 'Close',
        });
        break;
        case 'link':
          this.setState({
            modalType: type,
            title: 'External Links',
            confirm: 'See',
            reject: 'Close',
          });
          break;
      case 'search':
        this.setState({
          modalType: type,
          title: 'Search',
          confirm: '',
          reject: '',
        });
      default:
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  getQuery() {
    let query = FlowRouter.getQueryParam(this.props.query);
    query = query === undefined ? null : query;
    return query;
  }
  grabText = ({ target: { value } }) => {
    this.setState({
      value,
    });
  };
  render() {
    const { isOpen, title, confirm, reject, modalType } = this.state;
    return (
      <>
        <div className="container-fluid header-container">
          <div className="row ">
            <div className="col s12 m6">{this.renderInstitution()}</div>
            <div className="col s12 m2 hide-on-small-only">
              <SearchView
                action={'/results'}
                placeholder={'Search'}
                query={'q'}
                sClass={'searchAnim'}
              />
            </div>
            <div className="row ">
              <div className="col s2 m1 head-icons ">{this.countNotifications()}</div>
              <div className="col s2 m1 head-icons ">
                <a href="/reference" className="fa fa-book fa-2x inst-link" />
              </div>

              <div className="col s2 m1 head-icons hide-on-med-and-up">
                <a
                  href=""
                  className="inst-link fa fa-search"
                  onClick={e => this.toggleEditModal(e, 'search')}
                />
              </div>
              <div className="col s2 m1 head-icons">
                <a
                  href="#"
                  className={
                    this.props.count > 0
                      ? 'fa fa-star fa-2x inst-link'
                      : 'fa fa-star-o fa-2x inst-link'
                  }
                  data-activates="slide-out"
                  onClick={e => this.toggleEditModal(e, 'bookmark')}
                >
                  <span className="new" />
                </a>
              </div>

              <div className="col s2 m1 head-icons">
                <div
                  href="#"
                  data-activates="slide-out"
                >
                  <div className="dropdownLink">
                    <button className="dropbtnLink fa fa-link fa-2x inst-link"></button>
                    <div className="dropdownLink-content">
                      <a href="/externallinkpages"
                      className = "openLinks">
                    Click here to  Open all the external links in a page</a>
                    <p className=" blue-text externalLink" >
                    <b> External Links</b>
                  </p>
                    <hr />
                        {this.renderExternalLinks('')}
                    </div>
                  </div>
                  <span className="new" />
                </div>
              </div>

              <div className="col s2 m1 head-icons ">
                <a className="dropdown-button inst-link " href="#" data-activates="dropdown1">
                  <i className="fa fa-user fa-2x" id="usrIcon" />
                </a>
                <ul id="dropdown1" className="dropdown-content">
                  <li id="dropBody">
                    <div id="accName">
                      {this.getUserName()}
                      <span id="userEmail">{this.getEmail()}</span>

                      <span>{!Meteor.loggingIn() ? '' : Meteor.userId()}</span>

                      <span id="uiWrapper">
                        <a href="#" onClick={this.openSettings}>
                          {Meteor.userId() ? (
                            <span className="btn-flat" id="accounts-button">
                              Logout
                            </span>
                          ) : (
                            <span className="btn-flat" id="accounts-button">
                              You are not Logged in
                            </span>
                          )}
                        </a>
                      </span>
                    </div>
                  </li>
                  <li id="dropFooter">{this.dashBoard()}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* feedback modal to be changed */}
        <MainModal
          show={isOpen}
          onClose={this.close}
          subFunc={this.handleSubmit}
          title={title}
          confirm={confirm}
          reject={reject}
        >
          {modalType === 'note' ? (
            <div className="row">
              <div className="">
                <a
                  href=""
                  className=" blue-text "
                  style={{ fontSize: '11px' }}
                  onClick={this.markAllAsVisited.bind(this, true)}
                >
                  <u> Mark opened as read</u>
                </a>
              </div>

              <ul className="collection">{this.renderNotifications('')}</ul>
            </div>
          ) : modalType === 'bookmark' ? (
            <Bookmark />
          ) : modalType === 'link' ? (
            <div className="row">
            </div>
          ) : modalType === 'search' ? (
            <div className="searchbox-wrapper">
              <input
                className={''}
                name={'search'}
                type="search"
                defaultValue={this.getQuery()}
                id="searchField"
                placeholder={'Search'}
                onChange={this.grabText}
              />
            </div>
          ) : (
            ''
          )}
        </MainModal>
      </>
    );
  }
}

Header.propTypes = {
  count: PropTypes.number,
  institution: PropTypes.object,
  notificationsCount: PropTypes.number,
  notifications: PropTypes.array,
};

export default withTracker(() => {
  Meteor.subscribe('notifications');
  Meteor.subscribe('externallinks')
  Meteor.subscribe('institution');
  Meteor.subscribe('bookmarks');
  Meteor.subscribe('logo');
  return {
    notificationsCount: _Notifications.find({ read: false, userId: Meteor.userId() }).count(),
    notifications: _Notifications
      .find({ read: false, userId: Meteor.userId() }, { sort: { createdAt: -1 } })
      .fetch(),
    externallinks: _ExternalLink.find({}).fetch(),
    institution: Institution.findOne({}, { sort: { 'meta.createdAt': -1 } }),
    count: _Bookmark.find({ user: Meteor.userId() }, { sort: { color: 1 } }).count(),
  };
})(Header);
