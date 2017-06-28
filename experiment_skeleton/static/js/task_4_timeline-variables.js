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

/*
 trials contains a list of objects with the stimulus and data for each word trial.
 */
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

/* we've modified the 'word' trial to use timeline variables for 'stimulus' and 'data'*/
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
    /* now we nest the fixation-word pairs into a 'test_procedure' trial */
    timeline: [fixation, word],
    /* the timeline_variable property contains a list of properties to differentiate each trial */
    timeline_variables: trials,
    /* the trial specifications in timeline_variables will be completed in a random order */
    randomize_order: true
};

timeline.push(test_procedure);

jsPsych.init({
    display_element: 'jspsych-target',
    timeline: timeline
});
