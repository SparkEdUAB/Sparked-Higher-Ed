import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { _Courses } from '../../../api/courses/courses';
import { _Units } from '../../../api/units/units';
import { _Topics } from '../../../api/topics/topics';
import { References } from '../../../api/resources/resources';
import { Header } from '../layouts/Header.jsx';
import { FloatingButton, SearchField } from './../Utilities/Utilities.jsx';
import Unit, { ExtraResource } from '../content/Unit.jsx';
import { Loader } from '../Loader';

export class CourseContent extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  renderUnits(name) {
    let index = 0;
    const { unitd } = this.props;
    if (unitd === undefined) {
      return null;
    } else if (unitd.length < 1) {
      return `No units for ${name} has been added yet,Please Check again soon!!`;
    }

    return unitd.map(unit => <Unit key={index++} unit={unit} />);
  }

  renderExtra(name) {
    const { extras } = this.props;
    if (!extras) {
      return null;
    } else if (extras.length < 1) {
      return `No references for ${name} has been added yet,Please Check again soon!!`;
    }
    return extras.map(extra => (
      <ExtraResource
        key={extra._id}
        resourceId={extra._id}
        name={extra.name}
        courseId={getCourseId()}
        fileType={extra.ext}
      />
    ));
  }
  render() {
    return (
      <Fragment>
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <SearchField
              action={'/results'}
              placeholder={'Search for Units and Resources'}
              query={'q'}
            />
          </div>
          <h3>
            <a name="courses">
              <b>{courseName(this.props.courseName)}</b>
            </a>
          </h3>
          <div className="row ">
            {this.props.subsReady ? (
              this.renderUnits(courseName(this.props.courseName))
            ) : (
              <Loader />
            )}
          </div>
          {this.props.extras.length < 1 ? (
            <span />
          ) : (
            <div className="row col m4">
              <h4>
                <a name="references">References</a>
              </h4>
              <hr />
              {this.renderExtra(courseName(this.props.courseName))}
            </div>
          )}
        </div>

        <FloatingButton />
      </Fragment>
    );
  }
}

export function getCourseId() {
  return FlowRouter.getParam('_id');
}

export function courseName(coll) {
  if (coll === undefined) {
    return null;
  }
  return coll.name;
}

export function getTopicId() {
  const topicId = FlowRouter.getQueryParam('rs');
  const topics = _Topics.findOne({ unitId: FlowRouter.getParam('_id') });

  if (topicId === undefined && topics !== undefined) {
    return topics._id;
  } else if (topics === undefined) {
    return '1';
  }
  return topicId;
}

CourseContent.propTypes = {
  subsReady: PropTypes.bool.isRequired,
  unitd: PropTypes.array.isRequired,
  courseName: PropTypes.object,
  courses: PropTypes.array.isRequired,
  extras: PropTypes.array.isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('units');
  const handle = Meteor.subscribe('courses'); // a better way of adding a loading
  Meteor.subscribe('courses');
  Meteor.subscribe('resources');
  Meteor.subscribe('references');
  return {
    subsReady: handle.ready(),
    unitd: _Units
      .find({ 'details.courseId': getCourseId() }, { fields: { name: 1, details: 1 } })
      .fetch(),
    courseName: _Courses.findOne({ _id: getCourseId() }, { fields: { name: 1 } }),
    courses: _Courses.find({ _id: getCourseId() }, { fields: { name: 1 } }).fetch(),
    extras: References.find(
      { 'meta.courseId': getCourseId() },
      { fields: { name: 1, ext: 1 } },
    ).fetch(),
  };
})(CourseContent);
