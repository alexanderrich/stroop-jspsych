/* load psiturk */
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

var timeline = [];


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

timeline.push(welcome_block);

var instructions_block = {
    type: "text",
    text: "<p>In this experiment, a word will appear in the center " +
        "of the screen.</p><p>When the word appears respond with the <strong>color</strong> " +
        "in which the word is printed as quickly as you can.</p><p> press <strong>R</strong> " +
        "for red, <strong>G</strong> for green, and <strong>B</strong> for blue.</p>" +
        "<p>Press the SPACE key to begin.</p>",
    timing_post_trial: 2000,
    cont_key: [' '],
    on_finish: function(){
        psiturk.finishInstructions();
    }
};

timeline.push(instructions_block);

/* stimuli specifications */
var trials = [
    {
        stimulus: "<p class='stim' style='color: red;'>SHIP</p>",
        data: {word: 'SHIP', color: 'red', stimulus_type: 'unrelated', correct_response: 'R'}
    },
    {
        stimulus: "<p class='stim' style='color: green;'>MONKEY</p>",
        data: {word: 'MONKEY', color: 'green', stimulus_type: 'unrelated', correct_response: 'G'}
    },
    {
        stimulus: "<p class='stim' style='color: blue;'>ZAMBONI</p>",
        data: {word: 'ZAMBONI', color: 'blue', stimulus_type: 'unrelated', correct_response: 'B'}
    },
    {
        stimulus: "<p class='stim' style='color: red;'>RED</p>",
        data: {word: 'RED', color: 'red', stimulus_type: 'congruent', correct_response: 'R'}
    },
    {
        stimulus: "<p class='stim' style='color: green;'>GREEN</p>",
        data: {word: 'GREEN', color: 'green', stimulus_type: 'congruent', correct_response: 'G'}
    },
    {
        stimulus: "<p class='stim' style='color: blue;'>BLUE</p>",
        data: {word: 'BLUE', color: 'blue', stimulus_type: 'congruent', correct_response: 'B'}
    },
    {
        stimulus: "<p class='stim' style='color: red;'>GREEN</p>",
        data: {word: 'GREEN', color: 'red', stimulus_type: 'incongruent', correct_response: 'R'}
    },
    {
        stimulus: "<p class='stim' style='color: green;'>BLUE</p>",
        data: {word: 'BLUE', color: 'green', stimulus_type: 'incongruent', correct_response: 'G'}
    },
    {
        stimulus: "<p class='stim' style='color: blue;'>RED</p>",
        data: {word: 'RED', color: 'blue', stimulus_type: 'incongruent', correct_response: 'B'}
    }
];

var test_procedure = {
    timeline: [
        {
            type: 'single-stim',
            stimulus: '<p class="fixation">+</p>',
            choices: jsPsych.NO_KEYS,
            timing_response: 500,
            is_html: true,
            data: {stimulus_type: 'fixation'}
        },
        {
            type: 'single-stim',
            stimulus:  jsPsych.timelineVariable('stimulus'),
            choices: ['r','g', 'b'],
            is_html: true,
            data: jsPsych.timelineVariable('data'),
            on_finish: function(d){
                d.correct = d.key_press == d.correct_response.charCodeAt(0);
            }
        }
    ],
    timeline_variables: trials,
    randomize_order: true
};
timeline.push(test_procedure);

var summary = {
    type: 'single-stim',
    stimulus: function(){
        var congruent_rt = jsPsych.data.get().filter({stimulus_type: 'congruent'}).select('rt').mean();
        var incongruent_rt = jsPsych.data.get().filter({stimulus_type: 'incongruent'}).select('rt').mean();
        var unrelated_rt = jsPsych.data.get().filter({stimulus_type: 'unrelated'}).select('rt').mean();
        var congruent_pct = 100 * jsPsych.data.get().filter({stimulus_type: 'congruent'}).select('correct').mean();
        var incongruent_pct = 100 * jsPsych.data.get().filter({stimulus_type: 'incongruent'}).select('correct').mean();
        var unrelated_pct = 100 * jsPsych.data.get().filter({stimulus_type: 'unrelated'}).select('correct').mean();
        return '<p>Your average response time on congruent trials was '+Math.round(congruent_rt)+'ms. '+
            'Your average response time on incongruent trials was '+Math.round(incongruent_rt)+'ms. '+
            'Your average response time on unrelated trials was '+Math.round(unrelated_rt)+'ms.</p>'+
            '<p>Your average percent correct on congruent trials was '+Math.round(congruent_pct)+'%. '+
            'Your average percent correct on incongruent trials was '+Math.round(incongruent_pct)+'%. '+
            'Your average percent correct on unrelated trials was '+Math.round(unrelated_pct)+'%.</p>'+
            '<p>Thanks for participating!</p>';
    },
    choices: ['q'],
    is_html: true
};
timeline.push(summary);

/* start the experiment */

jsPsych.init({
    display_element: 'jspsych-target',
    timeline: timeline,
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
