import $                 from 'jquery';
import { readFixture }   from '../../../specs_support/utils';
import { transformItem } from './clix';

describe('transformItem', () => {
  let result;
  let data;
  let item = {};
  const state = {
    assessment: {
      items: [{
        json: {
          genusTypeId: 'question-type%3Aqti-upload-interaction-audio%40ODL.MIT.EDU',
          timeValue: {
            hours: 1,
            minutes: 1,
            seconds: 3,
          },
        },
        title: '',
        xml: '',
      },
      {
        json: {
          genusTypeId: 'question-type%3Aqti-order-interaction-mw-sandbox%40ODL.MIT.EDU',
          timeValue: {
            hours: 1,
            minutes: 1,
            seconds: 5,
          },
        },
        title: '',
        xml: '',
      },
      {
        json: {
          genusTypeId: 'question-type%3Aqti-upload-interaction-audio%40ODL.MIT.EDU',
        },
        title: '',
        xml: '',
      }],
    },
  };
  const multiSelectSurvey = {
    json: {
      genusTypeId: 'question-type%3Aqti-choice-interaction-multi-select-survey%40ODL.MIT.EDU',
    },
    title: '',
    xml: '',
  };
  const survey = {
    json: {
      genusTypeId: 'question-type%3Aqti-choice-interaction-survey%40ODL.MIT.EDU',
    },
    title: '',
    xml: '',
  };

  it('transforms ART question with timeValue into allQuestions state', () => {
    // the clix parser expects xml, pass it in as a file
    data = readFixture('clix/audio-upload.xml');
    item = state.assessment.items[0];
    item.xml = $($.parseXML(data));
    result = transformItem(item);
    expect(result.audioTimeout).toEqual(3663);
  });

  it('transforms MW Sandbox question with timeValue into allQuestions state', () => {
    data = readFixture('clix/mw-sandbox.xml');
    item = state.assessment.items[1];
    item.xml = $($.parseXML(data));
    result = transformItem(item);
    expect(result.audioTimeout).toEqual(3665);
  });

  it('transforms ART question with timeValue of null into allQuestions state', () => {
    data = readFixture('clix/audio-upload.xml');
    item = state.assessment.items[2];
    item.xml = $($.parseXML(data));
    result = transformItem(item);
    expect(result.audioTimeout).toEqual(null);
  });

  it('transforms multi-select Reflection question type', () => {
    data = readFixture('clix/multi-select-survey-question.xml');
    item = multiSelectSurvey;
    item.xml = $($.parseXML(data));
    result = transformItem(item);
    expect(result.question_type).toEqual('multiple_answer_survey_question');
  });

  it('transforms Reflection question type', () => {
    data = readFixture('clix/survey-question.xml');
    item = survey;
    item.xml = $($.parseXML(data));
    result = transformItem(item);
    expect(result.question_type).toEqual('survey_question');
  });
});
