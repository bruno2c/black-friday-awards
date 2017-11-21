<?php

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

require_once __DIR__.'/../src/routes.php';
require_once __DIR__.'/../app/db.php';

$app['debug'] = true;

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => [
        __DIR__.'/../src/Contest/Resources/views',
        __DIR__.'/../src/Admin/Resources/views',
    ]
));

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => $db,
));

$app->run();