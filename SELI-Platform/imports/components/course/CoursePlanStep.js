import React , {useEffect}from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
//import SimulateButtons from "./simulate";
import Grid from "@material-ui/core/Grid";
import PublishIcon from "@material-ui/icons/Publish";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import FeedbackHelp from "./feedback";


const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "30em"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "30em"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  },
  upload: {
    "& svg": {
      width: "5em",
      height: "5em",
      marginRight: "0.5em"
    },
    "& $uploadCaption": {
      marginLeft: ".5em"
    },
    "& $textField": {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "21.5em"
    }
  },
  uploadCaption: {},
  img: {
    // "& svg": {
    width: "5em",
    height: "5em",
    marginRight: "0.5em"
    // },
  }
}));

export default function CoursePlanStep(props) {
  const classes = useStyles();

  const [courseInformation, setCourseInformation]=React.useState(props.courseInformation)

  const [coursePlan, setCoursePlan] = React.useState("guided");
  const [courseTemplate, setCourseTemplate] = React.useState("without");
  const [courseStruct, setCourseStruct] = React.useState("unit");

  // will hold a reference for our real input file
  let inputFile = "";

  const changeCoursePlan = event => {
    let cinformation=courseInformation;
    cinformation.coursePlan.guidedCoursePlan=event.target.value;
    setCoursePlan(event.target.value);
    setCourseInformation(cinformation);
    props.updateCourseInformation(cinformation);
  }

  const handleUploadButton = event => {
    if (event.which === 32 || event.which === 13) {
      // alert("button click redirects to input click")
      event.preventDefault();
      inputFile.click();
      return false;
    }
  };

  return (
    <React.Fragment>
      <div className="form-input-column">
        <h3>Guided Course Plan</h3>
        <FormLabel component="legend">
          How would you like to create your course?
        </FormLabel>
        <RadioGroup
          aria-label="Course Plan"
          name="coursePlan"
          value={coursePlan}
          onChange={changeCoursePlan}      
        >
          <FormControlLabel value="guided" control={<Radio />} label="Guided" />
          <FormControlLabel value="free" control={<Radio />} label="Free" />
        </RadioGroup>
        <FeedbackHelp
          validation={{
            error: false,
            errorMsg: "",
            errorType: "",
            a11y: null
          }}
          tipMsg="Instructions goes here."
          describedBy={"i05-helper-text"}
        />
      </div>
    </React.Fragment>
  );
}