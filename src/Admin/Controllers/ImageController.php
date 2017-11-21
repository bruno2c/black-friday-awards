<?php

namespace Admin\Controllers;

use Admin\Core\ImagesLoader;
use Models\Contest;
use Models\Image;
use Silex\Application;

class ImageController
{
    public function index(Application $app)
    {
        $imageModel = new Image($app);
        $images = $imageModel->findAllWithRelatedData();

        return $app['twig']->render('image/index.twig', ['images' => $images]);
    }

    public function import($contestId = null, Application $app)
    {
        $modelContest = new Contest($app);
        $contest = null;

        if (!$contestId) {
            $contest = $modelContest->findOneRunning();
        }

        if ($contestId) {
            $contest = $modelContest->find($contest);
        }

        if (!$contest) {
            throw new \Exception('Nenhum concurso está acontecendo no momento');
        }

        $imageLoader = new ImagesLoader($app);
        $imageLoader->load($contest);
    }
}