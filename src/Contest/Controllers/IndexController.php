<?php

namespace Contest\Controllers;

use Silex\Application;

class IndexController
{
    public function index(Application $app)
    {
        return $app['twig']->render('index/index.twig');
    }

}