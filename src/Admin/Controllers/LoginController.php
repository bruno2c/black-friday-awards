<?php

namespace Admin\Controllers;

use Models\Contest;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class LoginController
{
    public function index(Application $app, Request $request)
    {
        return $app['twig']->render('login/index.twig', [
            'error' => $app['security.last_error']($request),
            'last_username' => $app['session']->get('_security.last_username')
        ]);
    }

    public function loginCheck(Application $app)
    {
        if ($app['security.authorization_checker']->isGranted('ROLE_ADMIN')) {
            return true;
        }

        return false;
    }
}