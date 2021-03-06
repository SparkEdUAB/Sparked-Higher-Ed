import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { isLoggedOut, checkPassword } from './AccountFunction.js';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    };
  }

  loginUser = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    Meteor.call('account.check', email, (err, result) => {
      if (result) {
        this.setState({
          error: result,
        });
      } else {
        Meteor.loginWithPassword(email, password, error => {
          if (error) {
            this.setState({
              error: error.reason,
            });
          } else {
            // Don't use FlowRouter.go('/) to allow updating the admin details;
            if (localStorage.getItem('beenhere')) {
              //   window.location = '/';
              FlowRouter.go('/');
            } else {
              localStorage.setItem('beenhere', true);
              // setup is an admin route, normal users will be redirected to Home Page
              window.location = '/setup';
            }
          }
        });
      }
    });
  };

  render() {
    const { error } = this.state;
    return (
      <div className="register-page">
        <div className="container account-container">
          <div className="row">
            <form className="col s12" id="reg-form" onSubmit={this.loginUser}>
              <div className="row">
                <div className="input-field col s12">
                  <input id="email" type="email" className="validate field" required />
                  <label htmlFor="email">Email</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="password"
                    type="password"
                    className="validate field"
                    minLength="6"
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s6">
                  <button
                    className="btn btn-large btn-register waves-effect waves-light"
                    type="submit"
                  >
                    {' '}
                    Login
                    <i className="fa fa-paper-plane right" />
                  </button>
                </div>
              </div>
              {error ? <div className="row">{error}</div> : <span />}
            </form>
          </div>
          <a
            title="Register"
            href="/register"
            className="ngl btn-floating btn-large waves-effect  waves-light"
            data-tooltip="Register"
          >
            <i className="fa fa-sign-in" />
          </a>
        </div>
      </div>
    );
  }
}
