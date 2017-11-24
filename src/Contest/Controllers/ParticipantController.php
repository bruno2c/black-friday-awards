<?php

namespace Contest\Controllers;

use Models\Contest;
use Models\Image;
use Models\Participant;
use Models\ParticipantVote;
use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ParticipantController
{
    public function index($contestId, $document, Application $app)
    {
        $response = [];

        try {

            $participantModel = new Participant($app);
            $participant = $participantModel->findOneByDocument($document);

            if (!$participant) {
                throw new \Exception('Participante não cadastrado');
            }

            $participantVoteModel = new ParticipantVote($app);
            $votes = $participantVoteModel->getParticipantVotes($participant['id'], $contestId);
            $totalVotes = count($votes);

            $contestModel = new Contest($app);
            $remainingVotes = $contestModel->calcRemainingVotesByParticipant($contestId, $totalVotes);

            $response = [
                'code' => Response::HTTP_OK,
                'participant' => $participant,
                'votes' => $votes,
                'total_votes' => $totalVotes,
                'remaining_votes' => $remainingVotes
            ];
        } catch (\Exception $e) {
            $response['code'] = Response::HTTP_BAD_REQUEST;
            $response['message'] = $e->getMessage();
        }

        return new JsonResponse($response);
    }

    public function vote(Request $request, Application $app)
    {
        $response = [];
        $app['db']->beginTransaction();

        try {

            $data = $request->request->all();
            if (!isset($data['document'])) {
                throw new \Exception('O campo "document" é obrigatório');
            }

            if (!isset($data['contest_id'])) {
                throw new \Exception('O campo "contest_id" é obrigatório');
            }

            if (!isset($data['images']) || !count($data['images'])) {
                throw new \Exception('O campo "images" é obrigatório');
            }

            $arrImages = explode(',', $data['images']);

            $participantModel = new Participant($app);
            $participant = $participantModel->findOneByDocument($data['document']);

            if (!$participant) {
                throw new \Exception('Participante não cadastrado');
            }

            $participantVoteModel = new ParticipantVote($app);
            $votes = $participantVoteModel->getParticipantVotes($participant['id'], $data['contest_id']);
            $totalVotes = count($votes);

            $contestModel = new Contest($app);
            $remainingVotes = $contestModel->calcRemainingVotesByParticipant($data['contest_id'], $totalVotes);

            if ($remainingVotes < 1) {
                throw new \Exception('Voto não registrado: Número máximo de votos excedido');
            }

            if (count($arrImages) > $remainingVotes) {
                throw new \Exception(sprintf('Você escolheu %s foto(s), mas só possui %s voto(s) restante(s)', count($arrImages), $remainingVotes));
            }

            foreach ($arrImages as $imageId) {
                $imageModel = new Image($app);
                $image = $imageModel->find($imageId);

                if (!$image) {
                    throw new \Exception('Foto não encontrada');
                }

                $imageAlreadyVoted = $participantVoteModel->checkParticipantVoteForImage($participant['id'], $imageId);

                if ($imageAlreadyVoted) {
                    throw new \Exception(sprintf('Você já votou na foto %s', $imageId));
                }

                $participantVoteModel->registerVote($participant['id'], $imageId);
            }

            $app['db']->commit();

            $response = [
                'code' => Response::HTTP_OK,
                'message' => 'Voto registrado com sucesso!'
            ];
        } catch (\Exception $e) {
            $app['db']->rollback();

            $response['code'] = Response::HTTP_BAD_REQUEST;
            $response['message'] = $e->getMessage();
        }

        return new JsonResponse($response);
    }
}