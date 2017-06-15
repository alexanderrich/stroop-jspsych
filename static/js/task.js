/* load psiturk */
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);


/* record id, condition, counterbalance on every trial */
jsPsych.data.addProperties({
    uniqueId: uniqueId,
    condition: condition,
    counterbalance: counterbalance
});

var welcome_block = {
    type: "text",
    text: "Welcome to the experiment. Press the SPACE key to begin.",
    cont_key: [' ']
};

var instructions_block = {
    type: "text",
    text: "<p>In this experiment, a word will appear in the center " +
        "of the screen.</p><p>When the word appears respond with the <strong>color</strong> " +
        "in which the word is printed as quickly as you can.</p><p> press <strong>R</strong> " +
        "for red, <strong>G</strong> for green, and <strong>B</strong> for blue.</p>" +
        "<p>Press the SPACE key to begin.</p>",
    timing_post_trial: 2000,
    cont_key: [' ']
};

/* stimuli specifications */
var test_stimuli = [
    {
        stimulus: "<span style='font-size: 50px; color: red;'>SHIP</span>",
        data: {
            word: 'SHIP',
            color: 'red',
            congruence: 'unrelated',
            correct_response: 'R'
        }
    },
    {
        stimulus: "<span style='font-size: 50px; color: green;'>MONKEY</span>",
        data: {
            word: 'MONKEY',
            color: 'green',
            congruence: 'unrelated',
            correct_response: 'G'
        }
    },
    {
        stimulus: "<span style='font-size: 50px; color: blue;'>ZAMBONI</span>",
        data: {
            word: 'ZAMBONI',
            color: 'blue',
            congruence: 'unrelated',
            correct_response: 'B'
        }
    },
    {
        stimulus: "<span style='font-size: 50px; color: red;'>RED</span>",
        data: {
            word: 'RED',
            color: 'red',
            congruence: 'congruent',
            correct_response: 'R'
        }
    },
    {
        stimulus: "<span style='font-size: 50px; color: green;'>GREEN</span>",
        data: {
            word: 'GREEN',
            color: 'green',
            congruence: 'congruent',
            correct_response: 'G'
        }
    },
    {
        stimulus: "<span style='font-size: 50px; color: blue;'>BLUE</span>",
        data: {
            word: 'BLUE',
            color: 'blue',
            congruence: 'congruent',
            correct_response: 'B'
        }
    },
    {
        stimulus: "<span style='font-size: 50px; color: red;'>GREEN</span>",
        data: {
            word: 'GREEN',
            color: 'red',
            congruence: 'incongruent',
            correct_response: 'R'
        }
    },
    {
        stimulus: "<span style='font-size: 50px; color: green;'>BLUE</span>",
        data: {
            word: 'BLUE',
            color: 'green',
            congruence: 'incongruent',
            correct_response: 'G'
        }
    },
    {
        stimulus: "<span style='font-size: 50px; color: blue;'>RED</span>",
        data: {
            word: 'RED',
            color: 'blue',
            congruence: 'incongruent',
            correct_response: 'B'
        }
    },
];

/* shuffle stimuli */
var all_trials = jsPsych.randomization.shuffle(test_stimuli);

/* stroop test block. timeline is set to all_trials, so will cycle through the shuffled stimuli */
var test_block = {
    type: "single-stim",
    is_html: true,
    choices: ['R', 'G', 'B'],
    prompt: '<br/><strong style="font-size: 30px;">Respond Quickly!</strong><br/><span>Press (R) for red, (G) for green, and (B) for blue.</span>',
    timing_post_trial: 1000,
    timeline: all_trials
};

/* debrief block. Tell participant response time and percent correct. */

var debrief_block = {
    type: "text",
    text: function() {
        return "<p>Your average response time was <strong>" + 
            getAverageResponseTime() + "ms</strong>. You answered <strong>" +
            getPercentCorrect() + "%</strong> of trials correctly. Press " +
            "the SPACE key to complete the experiment. Thank you!</p>";
    },
    cont_key: [' ']
};


// returns average response time over all trials
function getAverageResponseTime() {
    var trials = jsPsych.data.getTrialsOfType('single-stim');

    var sum_rt = 0;
    var trial_count = 0;
    for (var i = 0; i < trials.length; i++) {
        sum_rt += trials[i].rt;
        trial_count++;
    }
    return Math.floor(sum_rt / trial_count);
}

// returns percent correct over all trials
function getPercentCorrect() {
    var trials = jsPsych.data.getTrialsOfType('single-stim');

    var sum_correct = 0;
    var trial_count = 0;
    for (var i = 0; i < trials.length; i++) {
        if(trials[i].key_press === trials[i].correct_response.charCodeAt(0)){
            sum_correct += 1;
        }
        trial_count++;
    }
    return Math.floor(100 * sum_correct / trial_count);
}


/* define experiment structure */

var experiment_blocks = [];
experiment_blocks.push(welcome_block);
experiment_blocks.push(instructions_block);
experiment_blocks.push(test_block);
experiment_blocks.push(debrief_block);


/* start the experiment */

jsPsych.init({
    display_element: $('#jspsych-target'),
    timeline: experiment_blocks,
    on_finish: function() {
        // record proportion correct as unstructured data
        psiturk.recordUnstructuredData("bonus", (.01 * getPercentCorrect()).toFixed(2));
        // save data
        psiturk.saveData({
            success: function() {
                // upon saving, add proportion correct as a bonus (see custom.py) and complete HIT
                psiturk.computeBonus("compute_bonus", function () {
                    psiturk.completeHIT();
                });
            }
        });
    },
    // record data to psiTurk after each trial
    on_data_update: function(data) {
        psiturk.recordTrialData(data);
    }
});
