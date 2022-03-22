const express = require('express');
const checklist = require('../models/checklist');
const Task = require('../models/task');

const router = express.Router();

const Checklist = require('../models/checklist');

router.get('/new', async (req, res) => {
    try {
        let checklist = new Checklist();
        res.status(200).render('checklists/new', { checklist: checklist });
    } catch (error) {
        res.status(500).render('pages/error', { errors: ' Erro ao carregar o formulário' })
    }
});

router.get('/', async (req, res) => {
    try {
        let checklists = await Checklist.find({});
        res.status(200).render('checklists/index', { checklists: checklists });
    } catch (error) {
        res.status(200).render('pages/error', { error: 'Erro ao exibir as Listas' });
    }
});

router.post('/', async (req, res) => {
    let { name } = req.body.checklist;
    let checklist = new Checklist({ name })
    try {
        await checklist.save();
        res.redirect('/checklists');
    } catch (error) {
        res.status(422).render('checklists/new', { checklists: { ...checklist, error } })
    }
});

router.get('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id).populate('tasks');
        res.status(200).render('checklists/show', { checklist: checklist });
    } catch (error) {
        res.status(500).render('pages/error', { errors: 'Erro ao exibir as Listas de tarefas' });
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id);
        res.status(200).render('checklists/edit', { checklist: checklist });
    } catch (error) {
        res.status(500).render('pages/error', { errors: 'Erro ao editar as Listas de tarefas' });
    }
});

router.put('/:id', async (req, res) => {
    let { name } = req.body.checklist;
    let checklist = await Checklist.findById(req.params.id);
    try {
        await checklist.update({ name});
        res.redirect('/checklists')
    } catch (error) {
        let errors = error.errors;
        res.status(422).render('checklists/edit', {checklist: {...checklist, errors}})
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findByIdAndRemove(req.params.id);
        if(checklist.tasks.length){
            await Task.deleteMany({_id:{$in: checklist.tasks}})
        }
        res.redirect('/checklists');
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Erro ao deletar as Listas de tarefas' });
    }
});
module.exports = router;