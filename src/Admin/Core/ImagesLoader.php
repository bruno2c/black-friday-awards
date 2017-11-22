<?php

namespace Admin\Core;

use Models\Image;
use Silex\Application;
use Symfony\Component\Finder\Finder;

class ImagesLoader
{
    private $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    public function load($contest = [], $path, $baseUrl = null)
    {
        $finder = new Finder();
        $finder->files()->in($path);

        $modelImage = new Image($this->app);

        if (!$finder->count()) {
            throw new \Exception("Nenhuma imagem encontrada no caminho informado");
        }

        foreach ($finder as $file) {
            $url = $baseUrl . '/' . $file->getFilename();
            list($width, $height) = getimagesize($file->getRealPath());

            $modelImage->insert($contest['id'], $file->getRealPath(), $url, $width, $height);
        }
    }
}