var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);


var timeline = [];

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
    cont_key: [' '],
    timing_post_trial: 1000,
    on_finish: function(){
        psiturk.finishInstructions();
    }
};

timeline.push(instructions_block);

var trials = [
    {
        stimulus: "<p style='font-size: 50px; color: red;'>SHIP</p>",
        data: {word: 'SHIP', color: 'red', stimulus_type: 'unrelated', correct_response: 'R'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: green;'>MONKEY</p>",
        data: {word: 'MONKEY', color: 'green', stimulus_type: 'unrelated', correct_response: 'G'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: blue;'>ZAMBONI</p>",
        data: {word: 'ZAMBONI', color: 'blue', stimulus_type: 'unrelated', correct_response: 'B'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: red;'>RED</p>",
        data: {word: 'RED', color: 'red', stimulus_type: 'congruent', correct_response: 'R'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: green;'>GREEN</p>",
        data: {word: 'GREEN', color: 'green', stimulus_type: 'congruent', correct_response: 'G'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: blue;'>BLUE</p>",
        data: {word: 'BLUE', color: 'blue', stimulus_type: 'congruent', correct_response: 'B'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: red;'>GREEN</p>",
        data: {word: 'GREEN', color: 'red', stimulus_type: 'incongruent', correct_response: 'R'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: green;'>BLUE</p>",
        data: {word: 'BLUE', color: 'green', stimulus_type: 'incongruent', correct_response: 'G'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: blue;'>RED</p>",
        data: {word: 'RED', color: 'blue', stimulus_type: 'incongruent', correct_response: 'B'}
    }
];

var fixation = {
    type: 'single-stim',
    stimulus: '<p style="font-size: 50px;">+</p>',
    choices: jsPsych.NO_KEYS,
    timing_response: 500,
    is_html: true,
    data: {stimulus_type: 'fixation'}
};

var word = {
    type: 'single-stim',
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ['r','g', 'b'],
    is_html: true,
    data: jsPsych.timelineVariable('data'),
    on_finish: function(d){
        d.correct = d.key_press == d.correct_response.charCodeAt(0);
    }
};

var test_procedure = {
    timeline: [fixation, word],
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
            '<p>Thanks for participating! Press "q" to finish the experiment.</p>';
    },
    choices: ['q'],
    is_html: true
};
timeline.push(summary);

/*
 record uniqueId, condition, and counterbalance in every trial.
 these variables are populated by psiturk server
*/
jsPsych.data.addProperties({
    uniqueId: uniqueId,
    condition: condition,
    counterbalance: counterbalance
});


jsPsych.init({
    display_element: 'jspsych-target',
    timeline: timeline,
    /* record data to locally to psiturk javascript object after each trial */
    on_data_update: function(data) {
        psiturk.recordTrialData(data);
    },
    /* called at end of experiment */
    on_finish: function() {
        /* record grand mean correct as unstructured data */
        psiturk.recordUnstructuredData("bonus", jsPsych.data.get()
                                       .filter([{stimulus_type: 'incongruent'},
                                                {stimulus_type: 'congruent'},
                                                {stimulus_type: 'unrelated'}])
                                       .select('correct')
                                       .mean()
                                       .toFixed(2));
        /* save data to database */
        psiturk.saveData({
            success: function() {
                /* upon saving, add proportion correct as a bonus (see custom.py) and complete HIT */
                psiturk.computeBonus("compute_bonus", function () {
                    psiturk.completeHIT();
                });
            }
        });
    }
});
