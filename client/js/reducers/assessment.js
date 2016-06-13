"use strict";

import { Constants as AssessmentConstants }  from "../actions/assessment";

const initialState = null;

export default (state = initialState, action) => {

  switch(action.type){

    case AssessmentConstants.LOAD_ASSESSMENT_DONE:
      return action.payload.assessment;
      break;

    default:
      return state;
  }

};