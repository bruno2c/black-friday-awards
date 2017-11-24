<?php

namespace Contest\Controllers;

use Models\Contest;
use Silex\Application;

class IndexController
{
    public function index($contestId = null, Application $app)
    {
        if (!$contestId) {
            $contestModel = new Contest($app);
            $contest = $contestModel->findOneRunning();

            $contestId = $contest['id'];
        }

        return $app['twig']->render('index/index.twig', ['contestId' => $contestId]);
    }

}