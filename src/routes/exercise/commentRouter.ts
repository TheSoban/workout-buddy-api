import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, validParameters, userCompleted, userNotDisabled } from '../../middleware'
import { Comment, Exercise, User, GithubUser, GoogleUser, FacebookUser, LocalUser } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

export const commentRouter = Router()

.get("/:exercise_id/comment", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { exercise_id } = req.params;
    
    const comments = await Comment.findAll({
      where: { exercise_id },
      attributes: ['comment_id', 'content'],
      include: [
        {
          model: User,
          attributes: ['provider'],
          include: [
            {
              model: GithubUser,
              attributes: ['username']
            },
            { 
              model: GoogleUser,
              attributes: ['display_name']
             },
            { 
              model: FacebookUser,
              attributes: ['display_name']
             }, 
            { 
              model: LocalUser,
              attributes: ['username'] 
            }
          ]
        }
      ]
    });

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'comments-found',
        comments: comments.map(comment => {
          if (comment.author.provider == 'github') return { comment_id: comment.comment_id, content: comment.content, author: comment.author.github_user.username }
          if (comment.author.provider == 'google') return { comment_id: comment.comment_id, content: comment.content, author: comment.author.google_user.display_name }
          if (comment.author.provider == 'facebook') return { comment_id: comment.comment_id, content: comment.content, author: comment.author.facebook_user.display_name }
          if (comment.author.provider == 'local') return { comment_id: comment.comment_id, content: comment.content, author: comment.author.local_user.username }
        })
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})

.post("/:exercise_id/comment/", userAuthenticated, userNotDisabled, userCompleted, [
  body('content').isLength({ min: 1, max: 300 }).trim().escape()
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;

    const { exercise_id } = req.params;

    const { content } = req.body;

    const exercise = await Exercise.findByPk(exercise_id);

    if (!exercise) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-exercise-id'
        }
      });
    }
    
    const newComment = await Comment.create({
      content,
      author_id: user_id,
      exercise_id
    })

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'comment-created',
        comment: {
          content: newComment.content
        }
      }
    });

  } catch {

    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})

.post("/:exercise_id/comment/:comment_id/update", userAuthenticated, userNotDisabled, userCompleted, [
  body('content').isLength({ min: 1, max: 300 }).trim().escape()
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;

    const { exercise_id, comment_id } = req.params;

    const exercise = await Exercise.findByPk(exercise_id, {
      attributes: ['exercise_id']
    });

    if (!exercise) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-exercise-id'
        }
      });
    }

    const oldComment = await Comment.findOne({ 
      where: { comment_id, exercise_id, author_id: user_id },
      attributes: ['comment_id', 'content']
    })

    if (!oldComment) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-comment-id'
        }
      });
    }

    await oldComment.update(req.body);

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'comment-updated',
        comment: oldComment
      }
    });

  } catch {

    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})

.post("/:exercise_id/comment/:comment_id/delete", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;

    const { exercise_id, comment_id } = req.params;

    const exercise = await Exercise.findByPk(exercise_id, {
      attributes: ['exercise_id']
    });

    if (!exercise) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-exercise-id'
        }
      });
    }

    const oldComment = await Comment.findOne({ 
      where: { comment_id, exercise_id, author_id: user_id },
      attributes: ['comment_id', 'content']
    })

    if (!oldComment) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-comment-id'
        }
      });
    }

    await oldComment.destroy();

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'comment-deleted',
        comment: oldComment
      }
    });

  } catch {

    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})