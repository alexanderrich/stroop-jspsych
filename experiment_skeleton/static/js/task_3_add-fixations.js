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

var fixation = {
    type: 'single-stim',
    stimulus: '<p style="font-size: 50px;">+</p>',
    /* special command to tell the trial there is no response allowed */
    choices: jsPsych.NO_KEYS,
    /* length of trial in ms*/
    timing_response: 500,
    is_html: true,
    data: {stimulus_type: 'fixation'}
};

timeline.push(fixation);

var word1 = {
    type: 'single-stim',
    stimulus:   "<p style='font-size: 50px; color: red;'>SHIP</p>",
    choices: ['r','g', 'b'],
    is_html: true,
    data: {word: 'SHIP', color: 'red', stimulus_type: 'unrelated', correct_response: 'R'},
    on_finish: function(d){
        d.correct = d.key_press == d.correct_response.charCodeAt(0);
    }
};

timeline.push(word1);


/* we can simply push the same fixation trial onto the timeline again as there are no changes */
timeline.push(fixation);

var word2 = {
    type: 'single-stim',
    stimulus: "<p style='font-size: 50px; color: blue;'>RED</p>",
    choices: ['r','g', 'b'],
    is_html: true,
    data: {word: 'RED', color: 'blue', stimulus_type: 'incongruent', correct_response: 'B'},
    on_finish: function(d){
        d.correct = d.key_press == d.correct_response.charCodeAt(0);
    }
};

timeline.push(word2);

/*
   challenge: add a third trial with a new word and fixation
   be sure that stimulus and data are consistent with each other
*/


jsPsych.init({
    display_element: 'jspsych-target',
    timeline: timeline
});
