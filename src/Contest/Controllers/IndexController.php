<?php

namespace Contest\Controllers;

use Models\Contest;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class IndexController
{
    public function index($contestId = null, Request $request, Application $app)
    {
        if (!$contestId) {
            $contestModel = new Contest($app);
            $contest = $contestModel->findOneRunning();

            $contestId = $contest['id'];
        }

        $baseUrl = $request->getSchemeAndHttpHost();

        return $app['twig']->render('index/index.twig', ['contestId' => $contestId, 'baseUrl' => $baseUrl]);
    }

}