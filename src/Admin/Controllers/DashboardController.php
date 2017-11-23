<?php

namespace Admin\Controllers;

use Silex\Application;

class DashboardController
{
    public function index(Application $app)
    {
        return $app['twig']->render('dashboard/index.twig');
    }
}