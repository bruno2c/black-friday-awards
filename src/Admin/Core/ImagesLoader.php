<?php

namespace Admin\Core;

use Models\Image;
use Silex\Application;
use Symfony\Component\Finder\Finder;

class ImagesLoader
{
    private $app;
    private $imagesPath;
    private $baseUrl;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->imagesPath = $app['config.filesystem']['images']['base_path'];
        $this->baseUrl = $app['config.filesystem']['images']['base_url'];
    }

    public function load($contest = [])
    {
        $finder = new Finder();
        $finder->files()->in($this->imagesPath);

        $modelImage = new Image($this->app);

        foreach ($finder as $file) {
            $url = $this->baseUrl . '/' . $file->getFilename();
            $modelImage->insert($contest['id'], $file->getRealPath(), $url);
        }
    }
}