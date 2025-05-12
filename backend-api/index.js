/*
import { Sequelize, DataTypes } from 'sequelize';
import User from './model/user.js';
*/
import express from 'express';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

import TaskRouter from './router/task-router.js';

app.use('/tasks', TaskRouter);

//Todo refatorar
import User from './model/user.js';
app.post('/users', async (req,res)=>{
  try{
      const user = await User.create(req.body);
      res.status(201).json(user);
  }catch(err){
      console.log(err);
      res.status(400).json("Erro ao criar usuario");
  }
});

app.listen(port, () => {
  console.log(`App de exemplo esta rodando na porta ${port}`)
});


/*
salvar();
  async function salvar() {
    const user = await User.create({
        firstName: 'Roberto',
        lastName: 'Silva'
    });
    console.log('Usuario Criado com Sucesso');
}

remove();
  async function remove() {
    // Delete everyone named "Jane"
  await User.destroy({
    where: {
      firstName: 'Maria',
    },
  });
  console.log("Usuario deletado com sucesso")
}

update();
async function update() {
  firstName.name = 'Ada';
  // the name is still "Jane" in the database
  await user.save();
  // Now their name has been updated to "Ada" in the database!  
}*/
  