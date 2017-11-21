<?php

namespace Admin\Controllers;

use Models\Contest;
use Silex\Application;

class ContestController
{
    public function index(Application $app)
    {
        $contestModel = new Contest($app);
        $contests = $contestModel->findAll();

        return $app['twig']->render('contest/index.twig', ['contests' => $contests]);
    }

    public function ranking(Application $app)
    {
        $contestModel = new Contest($app);
        $ranking = $contestModel->getRanking(1);

        return $app['twig']->render('contest/ranking.twig', ['ranking' => $ranking]);
    }
}