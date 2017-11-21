<?php

namespace Admin\Controllers;

use Models\Participant;
use Silex\Application;

class ParticipantController
{
    public function index(Application $app)
    {
        $participantModel = new Participant($app);
        $participants = $participantModel->findAll();

        return $app['twig']->render('participant/index.twig', ['participants' => $participants]);
    }
}