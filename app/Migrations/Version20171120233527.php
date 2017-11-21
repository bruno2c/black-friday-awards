<?php

namespace Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171120233527 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql("CREATE TABLE `contest` (
          `id` INT NOT NULL AUTO_INCREMENT,
          `name` VARCHAR(45) NOT NULL,
          PRIMARY KEY (`id`));
        ");

        $this->addSql("ALTER TABLE `contest` 
            ADD COLUMN `max_votes` INT NULL AFTER `name`;
        ");

        $this->addSql("ALTER TABLE `contest` 
            ADD COLUMN `status` VARCHAR(45) NOT NULL AFTER `max_votes`;
      ");

        $this->addSql("CREATE TABLE `participant` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `name` VARCHAR(255) NOT NULL,
            `document` VARCHAR(45) NOT NULL,
            PRIMARY KEY (`id`));
        ");

        $this->addSql("CREATE TABLE `image` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `path` VARCHAR(600) NOT NULL,
            `contest_id` INT NOT NULL,
            `owner_id` INT,
            PRIMARY KEY (`id`),
            INDEX `fk_image_owner_idx` (`owner_id` ASC),
            CONSTRAINT `fk_image_participant`
            FOREIGN KEY (`owner_id`)
            REFERENCES `participant` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION)
        ");

        $this->addSql("ALTER TABLE `image` 
            ADD COLUMN `url` VARCHAR(600) NULL AFTER `owner_id`;
        ");

        $this->addSql("ALTER TABLE `image` 
            ADD INDEX `fk_image_contest_idx` (`contest_id` ASC);
            ALTER TABLE `image` 
            ADD CONSTRAINT `fk_image_contest`
              FOREIGN KEY (`contest_id`)
              REFERENCES `contest` (`id`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION;
        ");

        $this->addSql("CREATE TABLE `ranking` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `image_id` INT NOT NULL,
            `total_votes` VARCHAR(45) NOT NULL,
            PRIMARY KEY (`id`),
            INDEX `fk_ranking_image_idx` (`image_id` ASC),
            CONSTRAINT `fk_ranking_image`
            FOREIGN KEY (`image_id`)
            REFERENCES `image` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION);
        ");

        $this->addSql("CREATE TABLE `participant_vote` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `participant_id` INT NOT NULL,
            `image_id` INT NOT NULL,
            `created_at` DATETIME NOT NULL,
            PRIMARY KEY (`id`));
        ");

        $this->addSql("ALTER TABLE `participant_vote` 
            ADD INDEX `fk_participant_vote_participant_idx` (`participant_id` ASC),
            ADD INDEX `fk_participant_vote_image_idx` (`image_id` ASC);
            ALTER TABLE `participant_vote` 
            ADD CONSTRAINT `fk_participant_vote_participant`
            FOREIGN KEY (`participant_id`)
            REFERENCES `participant` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
            ADD CONSTRAINT `fk_participant_vote_image`
            FOREIGN KEY (`image_id`)
            REFERENCES `image` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION;
        ");
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {

    }
}
