// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview Unit test for QuestionCreationService
 */

import { HttpClientTestingModule,
  HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { QuestionCreationService } from
  'components/entity-creation-services/question-creation.service.ts';

describe('Question Creation service', () => {
  let questionCreationService: QuestionCreationService;
  let httpTestingController: HttpTestingController;
  let SAMPLE_QUESTION_ID = 'hyuy4GUlvTqJ';
  let QUESTION_CREATOR_URL = '/question_editor_handler/create_new';

  let SUCCESS_STATUS_CODE = 200;
  let ERROR_STATUS_CODE = 500;
  let questionDict = {};

  beforeEach(()=>{
    TestBed.configureTestingModule({
      providers: [QuestionCreationService],
      imports: [HttpClientTestingModule]
    });

    questionCreationService = TestBed.get(QuestionCreationService);
    httpTestingController = TestBed.get(HttpTestingController);

    var sampleQuestionBackendDict = {
      id: 'question_id',
      question_state_data: {
        content: {
          html: 'Question 1',
          content_id: 'content_1'
        },
        interaction: {
          answer_groups: [{
            outcome: {
              dest: 'outcome 1',
              feedback: {
                content_id: 'content_5',
                html: ''
              },
              labelled_as_correct: true,
              param_changes: [],
              refresher_exploration_id: null
            },
            rule_specs: [{
              inputs: {
                x: 10
              },
              rule_type: 'Equals'
            }],
          }],
          confirmed_unclassified_answers: [],
          customization_args: {},
          default_outcome: {
            dest: null,
            feedback: {
              html: 'Correct Answer',
              content_id: 'content_2'
            },
            param_changes: [],
            labelled_as_correct: false
          },
          hints: [{
            hint_content: {
              html: 'Hint 1',
              content_id: 'content_3'
            }
          }],
          solution: {
            correct_answer: 'This is the correct answer',
            answer_is_exclusive: false,
            explanation: {
              html: 'Solution explanation',
              content_id: 'content_4'
            }
          },
          id: 'TextInput'
        },
        param_changes: [],
        recorded_voiceovers: {
          voiceovers_mapping: {
            content_1: {},
            content_2: {},
            content_3: {},
            content_4: {},
            content_5: {}
          }
        },
        written_translations: {
          translations_mapping: {
            content_1: {},
            content_2: {},
            content_3: {},
            content_4: {},
            content_5: {}
          }
        },
        solicit_answer_details: false
      },
      language_code: 'en',
      version: 1
    };
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should create a new question and call the success callback',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');

      questionCreationService.createNew(sampleQuestionBackendDict).then(
        successHandler, failHandler);

      let req = httpTestingController.expectOne(
        '/question_editor_handler/create_new');
      expect(req.request.method).toEqual('POST');
      req.flush({question_dict: sampleQuestionBackendDict});

      flushMicrotasks();

      expect(successHandler).toHaveBeenCalled();
      expect(failHandler).not.toHaveBeenCalled();
    })
  );

  it('should fail to create a question and call the fail handler',
    fakeAsync(()=>{
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');

      questionCreationService.createNew(sampleQuestionBackendDict).then(
        successHandler, failHandler);

      let req = httpTestingController.expectOne(
        '/question_editor_handler/create_new');
      expect(req.request.method).toEqual('POST');
      req.flush('Error creating a new question', {
        status: ERROR_STATUS_CODE,
        statusText: 'Error Creating a new question'
      });

      flushMicrotasks();

      expect(failHandler).toHaveBeenCalled();
      expect(successHandler).not.toHaveBeenCalled();
    })
  );
});
