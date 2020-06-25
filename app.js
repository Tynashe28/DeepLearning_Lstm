const tf = require('@tensorflow/tfjs')
const express = require('express');
const path = require('path');
const csv = require('csv-parser')
const fs = require('fs')

const app = express();
const n_layers = 3;
const learning_rate = 0.1;
const results = [];
const window_size = 20;
try {
    fs.createReadStream('Book2.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(results.json);
       }
    );
    
} catch (error) {
    console.log(error);
}




const myModel = tf.sequential();




// training data
// const xs =tf.tensor2d();
// const ys = tf.tensor2d();

// Creating Input Layer
const input_layer_shape  = window_size;
const input_layer_neurons = 100;
myModel.add(tf.layers.dense({
    units:input_layer_neurons,
    inputShape:[input_layer_shape]
}));

// deploying RNN layer
const rnn_input_layer_features = 10;
const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;
const rnn_input_shape  = [rnn_input_layer_timesteps,  rnn_input_layer_features];

myModel.add(tf.layers.reshape({
    targetShape:rnn_input_shape
}));

const rnn_output_neurons = 20;
let lstm_cells = [];
for (let index = 0; index < n_layers; index++) {
    lstm_cells.push(tf.layers.lstmCell({units: rnn_output_neurons}));
}

myModel.add(tf.layers.rnn({
    cell: lstm_cells,inputShape: rnn_input_shape,
    returnSequences: false
}));

// Output Layer
const output_layer_shape = rnn_output_neurons;
const output_layer_neurons = 1;
myModel.add(tf.layers.dense({
    units: output_layer_neurons, 
    inputShape: [output_layer_shape]
}));

// Compiling Model
const opt_adam = tf.train.adam(learning_rate);
myModel.compile({
    optimizer: opt_adam, 
    loss: 'meanSquaredError'
});

// Training Model
const rnn_batch_size = window_size;
(async ()=>{
    const hist = await myModel.fit(xs, ys,{
        batchSize: rnn_batch_size, 
        epochs: n_epochs, 
        callbacks: {
            onEpochEnd: async (epoch, log) => { 
                callback(epoch, log); 
            }
        }
    });
})()

const predictMoisture = () => {
    const outps = model.predict(tf.tensor2d(inps, [inps.length,
        inps[0].length]).div(tf.scalar(10))).mul(10);
     
     return Array.from(outps.dataSync());
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));
