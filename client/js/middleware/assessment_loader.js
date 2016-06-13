import Request                              from "superagent";
import { DONE }                             from "../constants/wrapper";
import { Constants as AssessmentConstants } from "../actions/assessment";
import { parse }                            from "../parsers/assessment";

const AssessmentLoad = store => next => action => {

  const loadAssessment = (settings, data) => {
    const assessment = parse(settings, data);
    store.dispatch({
      type:     action.type + DONE,
      payload:  assessment,
    });
  };

  if(action.type == AssessmentConstants.LOAD_ASSESSMENT){
    const state = store.getState();
    const assessmentData = state.settings.get("assessment_data");
    if(assessmentData){
      loadAssessment(state.settings, assessmentData);
    } else {
      // Make an api call to load the assessment
      Request.get(state.settings.get("src_url")).then((response, error) => {
        loadAssessment(state.settings, response.text);
      });
    }
  }

  // call the next middleWare
  next(action);

};

export { AssessmentLoad as default };
