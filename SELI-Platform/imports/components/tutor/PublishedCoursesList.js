import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Loading from '../../components/tools/Loading';
import { Courses } from '../../../lib/CourseCollection';
import Table from '../data_display/Table';

import StudentProfile from './StudentProfile';

import SchoolIcon from '@material-ui/icons/School';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import TabIcon from '@material-ui/icons/Tab';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import GroupIcon from '@material-ui/icons/Group';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppsIcon from '@material-ui/icons/Apps';
import DenseTable from './DenseTable';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import BookIcon from '@material-ui/icons/Book';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import SpellcheckRoundedIcon from '@material-ui/icons/SpellcheckRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';

export default class PublishedCoursesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myCourses: [],
      courseProfiles: [],
      studentInformation: '',
      studentScores: [],
      course: [],
    }
  }

  componentDidMount() {
    this.getMyCourses(this.props.user.username);
  }

  getMyCourses = (user) => {
    this.setState({
      loading: true,
    }, () => {
      Tracker.autorun(() => {
        let myCourses = Courses.find({createdBy: user, published: true}).fetch();
        this.setState({
          myCourses: myCourses,
        }, () => {
          let results = true;
          if (this.state.myCourses.length) {
            this.createTableData(this.state.myCourses);
          }
          else {
            results = false;
          }
          this.setState({
            loading: false,
            results: results,
          })
        });
      });
    });
  }

  preview = (_id) => {
    this.handleClickOpen();
    this.setState({
      course_id: _id,
      dialogConfirmationTitle: this.props.language.coursePreview,
      dialogConfirmationContentText: this.props.language.willBeRedirected
    })
  }

  unpublish = (_id) => {
    Courses.update(
      { _id: this.state.courseToUnpublish },
      { $set:
        {
          published: false,
        }
      }
    );
    this.handleClose();
    this.props.handleControlMessage(true, this.props.language.courseUnpublished, true, 'savedList', this.props.language.seeList);
  }

  createTableData = (myCourses) => {
    let tableData = [];
    let headRows = [
      { id: 'title', numeric: false, disablePadding: true, label: this.props.language.title },
      { id: 'organization', numeric: true, disablePadding: false, label: this.props.language.organization },
      { id: 'duration', numeric: true, disablePadding: false, label: this.props.language.duration },
      { id: 'creationDate', numeric: true, disablePadding: false, label: this.props.language.creationDate },
      { id: 'actions', numeric: true, disablePadding: false, label: this.props.language.actions },
    ];
    let menuOptions = [
      {label: this.props.language.coursePreview , icon: <TabIcon/>, action: this.preview.bind(this)},
      {label: this.props.language.classroomManagement , icon: <GroupIcon/>, action: this.openClassroomManagement.bind(this)},
      {label: this.props.language.unpublishCourse , icon: <UnarchiveIcon/>, action: this.showUnpublishConfirmation.bind(this)},
    ];
    myCourses.map(course => {
      tableData.push({title: course.title, organization: course.organization.label, duration: `${course.duration} hours`, creationDate: course.creationDate.toLocaleDateString('en-US'), _id: course._id})
    })
    this.setState({
      headRows: headRows,
      menuOptions: menuOptions,
      tableData: tableData,
    }, () => {
      this.setState({
        loading: false,
      })
    });
  }

  showUnpublishConfirmation = (_id) => {
    this.handleClickOpen();
    this.setState({
      dialogConfirmationTitle: this.props.language.unpublishCourse,
      dialogConfirmationContentText: this.props.language.areYouSureUnpublishCourse,
      courseToUnpublish: _id,
      confirmAction: () => this.unpublish(),
    });
  }

  openClassroomManagement = (_id) => {
    let courses = this.state.myCourses;
    let course = courses.find(course => course._id === _id);
    let classroom = course.classroom;
    let results = true;
    if (classroom.length) {
      this.setState({
        loadingProfiles: true,
      });
      let courseProfiles = [];
      classroom.map(student => {
        Tracker.autorun(() => {
          Meteor.call("GetUserById", student, (error, response) =>  {
              if (response) {
                let courseProfile = response[0].profile.courses.find(course => course.courseId === _id);
                courseProfiles.push({
                  studentId: student,
                  courseProfile: courseProfile,
                  studentInformation: {
                    fullname: response[0].profile.fullname,
                    username: response[0].username,
                    dateJoined: response[0].createdAt,
                  }
                });
              }
              if (courseProfiles.length === classroom.length) {
                this.setState({
                  loadingProfiles: false,
                  courseProfiles: courseProfiles,
                });
              }
          });
        });
      });
    }
    else {
      results = false;
    }
    this.setState({
      openClassroom: true,
      studentInformation: '',
      studentScores:[],
      course:[],
      classroomResults: results,
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleCloseClassroom = () => {
    this.setState({ openClassroom: false });
  };

  handleView= (event, studentScores, course)=>{
    console.log(event)
    this.setState({
      studentInformation: event,
      studentScores: studentScores,
      course,
    })
    /* else if(event==="quizDetails"){
      console.log("indice", index)
      this.setState({
        showQuizDetails:'showQuizDetails',
        index: index
      })
    } */
  }

  quizes= ()=>{
    return(
      <React.Fragment>

        <div className="library-files-containerquiz">
          {console.log(`${this.state.studentScores} scores`)}
        {this.state.studentScores.map((quiz, index) => (
          <div>
            <div className="studentTable">
              <h3>Quiz: {this.state.course[0].title}</h3>
            </div>
            <DenseTable quiz={quiz}/>
            <Button
                className="student-profile-button"
                color="primary"
                variant="outlined"
                onClick={() => this.handleView("quizDetails", this.state.studentScores, this.state.course)}
            >
                Quiz details*
            </Button>
          </div>   
        ))} 
        </div>
      </React.Fragment> 
    )
  
  }

  quizDetails=()=>{
    console.log(this.state.course, "course...", this.state.studentScores)
    return(
      <Paper elevation={8} className="quiz-dashboard-questions-containerTutor">
        <p className="question-dashboard-label-text">Quiz View Tool</p>
        <div className="question-dashboard-container">
          <FormControl component="fieldset" className="question-dashboard-form-controlx">
            {/* <FormLabel component="legend" className="question-dashboard-form-label">title quiz</FormLabel> */}
            <RadioGroup
              aria-label="answer"
              name="answer"
              className="question-dashboard-radio-group"
            >
            <div>
              <div  className="answers">Questions<BookIcon/></div>
              <div className="student-answers">
              {
                this.state.studentScores[0].activity.trueAnswers.map((question, indexQuestion) =>{
                  return(
                    <div>
                      <div className="answers">Question*: {question.questionTitle}</div>
                      {
                          question.answersText.map((answersText, indexanswersText) =>{
                            return(
                              <div className="student-answers-block-q">
                                <ul>{answersText}</ul>
                              </div>
                            )
                          }) 
                      } 
                    </div>
                        
                  )   
                })
              }
            </div>
            </div>


            <div>
              <div className="answers">Student Answers <CreateRoundedIcon/></div>
              <div className="student-answers">
                  {
                    this.state.studentScores.map((question, indexQuestion) =>
                        question.activity.answers.map((answers, indexanswers) =>{
                            return(
                              <div >
                                <div className="answers" >Answers*</div>
                                {answers.map((answer) =>{
                                  if(answer===true){answer=<div>Correct*<DoneRoundedIcon/></div>} else{answer=<div>Incorrect*<ClearRoundedIcon/></div>}
                                  return(
                                    <div className="student-answers-block">
                                      <ul>{answer}</ul>
                                    </div>
                                  )
                                })}
                              </div>
                            )
                          }
                        )
                    )
                  }
              </div>
            </div>
            

            <div>
              <div className="answers">Correct Answers<SpellcheckRoundedIcon/></div>
              <div className="student-answers">  
                {
                  this.state.studentScores[0].activity.trueAnswers.map((question, indexQuestion) =>{
                    return(
                      <div>
                        <div className="answers">Answers*</div>
                        {
                            question.answersText.map((answersText, indexanswersText) =>{
                              return(
                                <div className="student-answers-block">
                                  {
                                    question.correctAnswers[indexanswersText]===true ?
                                    <div>Correct*<DoneRoundedIcon/></div>
                                    :
                                    <div>Incorrect*<ClearRoundedIcon/></div>
                                  
                                  }
                                </div>
                              )
                            }) 
                        } 
                      </div>
                          
                    )   
                  })
                }
              </div>
            </div>
            
            
            
            </RadioGroup>
          </FormControl>
        </div>
      </Paper>
    )
  }

  menu = () => {
    return(
      <div className="course-content-container-quiz">
        <div className="course-content-breadcrumbs-container-quiz">
          <Paper elevation={0} className="course-content-breadcrumbs-paper-quiz">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Typography onClick={() => this.handleView("")} className="course-content-breadcrumb-text">
                {this.props.language.course}
              </Typography>
              <Typography onClick={() => this.handleView("quiz", this.state.studentScores, this.state.course)} className="course-content-breadcrumb-text">
                {this.props.language.quiz}
              </Typography>
              <Typography id="course-content-breadcrumb-title" className="course-content-breadcrumb-text">
                quiz details *
              </Typography>
              {/* <Typography id="course-content-breadcrumb-actual" className="course-content-breadcrumb-text">
                {`${this.props.language.unit} ${this.props.selected[1] + 1}: ${this.props.course.program[this.props.selected[1]].name}`}
              </Typography>
              <Typography id="course-content-breadcrumb-actual" className="course-content-breadcrumb-text">
                {`${this.props.language.lesson} ${this.props.selected[0] + 1}: ${this.props.course.program[this.props.selected[1]].lessons[this.props.selected[0]].name}`}
              </Typography> */}
            </Breadcrumbs>
          </Paper>
        </div>
      </div>
    )
  }

  render() {
    return(
      <div className="management-container">
        {
          this.state.loading ?
            <div className="loading-course-container">
              <Loading message="Loading my courses..."/>
            </div>
          :
          <React.Fragment>
            {
              this.state.results ?
                <div className="management-result-container">
                  <p className="management-title-published">{this.props.language.myPublishedCourses}<SchoolIcon className="management-title-icon"/></p>
                  <p className="management-title-suggestion">{`(${this.props.language.toEditPublished})`}</p>
                  <p className="management-title-suggestion-indent"></p>
                  <div className="management-table-container">
                    <Table
                      labels={{
                        title: this.props.language.youHaveCourses, 
                        pagination: this.props.language.coursePerPage,
                        filterList: this.props.language.filterList,
                        refresh: this.props.language.refresh,
                        delete: this.props.language.delete,
                        selected: this.props.language.selected,
                        nextPage: this.props.language.nextPage,
                        previousPage: this.props.language.previousPage,
                        options: this.props.language.options,
                        of: this.props.language.of,
                      }}
                      headRows={this.state.headRows}
                      menuOptions={this.state.menuOptions}
                      tableData={this.state.tableData}
                      delete={false}
                    />
                  </div>
                </div>
              :
              <div className="empty-dashboard">
                <div className="empty-dashboard-row">
                  <p className="empty-dashboard-text">{this.props.language.noCoursePublished}</p>
                  <InfoIcon className="empty-dashboard-icon"/>
                </div>
                <Button onClick={() => this.props.showComponent('create')} variant="contained" color="secondary" className="empty-dashboard-button">{this.props.language.createCourse}</Button>
              </div>
            }
          </React.Fragment>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-confirmation"
          aria-describedby="alert-dialog-confirmation"
        >
          <DialogTitle className="success-dialog-title" id="alert-dialog-title">{this.state.dialogConfirmationTitle}</DialogTitle>
          <DialogContent className="success-dialog-content">
            <DialogContentText className="success-dialog-content-text" id="alert-dialog-description">
              {this.state.dialogConfirmationContentText}
            </DialogContentText>
            {
              this.state.dialogConfirmationTitle === this.props.language.unpublishCourse ?
                <WarningIcon className="warning-dialog-icon"/>
              :
                <InfoIcon className="warning-dialog-icon"/>   
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose()} color="primary" autoFocus>
              {this.props.language.cancel}
            </Button>
            {
              this.state.dialogConfirmationTitle === this.props.language.unpublishCourse ?
                <Button onClick={() => this.state.confirmAction()} color="primary" autoFocus>
                  {this.props.language.confirm}
                </Button>
              :
                <Link className="button-link"
                  to={{
                    pathname: "/coursePreview",
                    hash: this.state.course_id,
                    state: { fromDashboard: true },
                    query: {language: this.props.language}
                  }}
                >
                  <Button color="primary" autoFocus>
                    {this.props.language.yes}
                  </Button>
                </Link>
            }
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.openClassroom}
          onClose={this.handleCloseClassroom}
          fullScreen
          aria-labelledby="alert-dialog-confirmation"
          aria-describedby="alert-dialog-confirmation"
        >
          <AppBar position="static" className="course-dialog-app-bar">
            <Toolbar style={{position: 'relative'}}>
              <IconButton edge="start" color="inherit" onClick={this.handleCloseClassroom} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography className="course-dialog-title" variant="h6">
                {this.props.language.classroomManagement}
              </Typography>
              <p className="app-tooltip">{this.props.language.pressEsc}</p>
            </Toolbar>
          </AppBar>
          <DialogContent className="classroom-dialog-content">
            {
              this.state.classroomResults ?
                <React.Fragment>
                  {
                    this.state.loadingProfiles ?
                      <div className="loading-course-container">
                        <Loading message={this.props.language.loadingStudents}/>
                      </div>
                    :
                    <React.Fragment>
                      <DialogContentText className="classroom-dialog-title" id="alert-dialog-description">
                        {this.props.language.studentsClassroom}
                      </DialogContentText>
                      {this.menu()}
                      <div className="classroom-management-students-container">
                        {
                          this.state.studentInformation===''?
                            this.state.courseProfiles.map((profile, index) => {
                              return(
                                <StudentProfile
                                  profile={profile}
                                  handleControlMessage={this.props.handleControlMessage.bind(this)}
                                  handleView={this.handleView}
                                  reload={this.openClassroomManagement.bind(this)}
                                  language={this.props.language}
                                />
                              )
                            })
                          :
                            undefined
                        }
                        {
                          this.state.studentInformation==='quiz'?
                            this.quizes()
                          :
                            undefined
                        }
                        {
                          this.state.studentInformation==='quizDetails'?
                            this.quizDetails()
                          :
                            undefined
                        }
                      </div>
                    </React.Fragment>
                  }
                </React.Fragment>
              :
              <div className="empty-dashboard">
                <div className="empty-dashboard-row">
                  <p className="empty-dashboard-text">{this.props.language.donotHaveStudents}</p>
                  <InfoIcon className="empty-dashboard-icon"/>
                </div>
              </div>
            }
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}
