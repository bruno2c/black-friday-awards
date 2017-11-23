<?php

namespace Admin\Controllers;

use Admin\Core\ImagesLoader;
use Models\Contest;
use Models\Image;
use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ImageController
{
    public function index(Application $app)
    {
        $imageModel = new Image($app);
        $images = $imageModel->findAllWithRelatedData();

        $contestModel = new Contest($app);
        $contests = $contestModel->findAll();

        return $app['twig']->render('image/index.twig', ['images' => $images, 'contests' => $contests]);
    }

    public function import(Request $request, Application $app)
    {
        $response = [];

        try {
            $data = $request->request->all();
            $modelContest = new Contest($app);

            if (!$data['contest_id']) {
                throw new \Exception('O campo "Concurso" é obrigatório');
            }

            if (!$data['path']) {
                throw new \Exception('O campo "Caminho" é obrigatório');
            }

            $contest = $modelContest->find($data['contest_id']);

            if (!$contest) {
                throw new \Exception('Concurso não encontrado');
            }

            $imageLoader = new ImagesLoader($app);
            $imageLoader->load($contest, $data['path'], $data['url']);

            $response = [
                'code' => Response::HTTP_OK,
                'message' => "Imagens importadas com sucesso!"
            ];
        } catch (\Exception $e) {
            $response['code'] = Response::HTTP_BAD_REQUEST;
            $response['message'] = $e->getMessage();
        }

        return new JsonResponse($response);
    }
}